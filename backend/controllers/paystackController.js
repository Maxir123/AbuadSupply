// backend/controllers/paystackController.js
const axios = require('axios');
const crypto = require('crypto');
const orderModel = require('../models/orderModel');

// Initialize Paystack transaction
exports.initializePayment = async (req, res) => {
  const { email, amount, orderId } = req.body;
  try {
    const payload = { email, amount, metadata: { orderId } };
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      payload,
      { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
    );
    // Send back Paystack response (includes authorization_url and reference)
    res.json(response.data);
  } catch (err) {
    console.error('Paystack initialize error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
};

// Handle Paystack webhook
exports.handleWebhook = async (req, res) => {
  // Verify Paystack signature【55†L175-L184】
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');
  if (hash !== req.headers['x-paystack-signature']) {
    console.error('Invalid Paystack signature');
    return res.status(400).send('Invalid signature');
  }
  const event = req.body;
  if (event.event === 'charge.success') {
    const { reference, amount, currency, metadata } = event.data;
    const { orderId } = metadata;
    try {
      // Update order in DB
      await orderModel.findByIdAndUpdate(orderId, {
        paymentMethod: 'Paystack',
        paymentReference: reference,
        paymentStatus: 'paid'
      });
      console.log(`Order ${orderId} marked as paid (Paystack)`);
    } catch (dbErr) {
      console.error('DB update error:', dbErr);
    }
  }
  // Acknowledge receipt of webhook
  res.sendStatus(200);
};
