const express = require('express');
const router = express.Router();

const {
  initializePayment,
  handleWebhook
} = require('../controllers/paystackController');

// Initialize payment
router.post('/initialize', initializePayment);

// Paystack webhook
router.post('/webhook', handleWebhook);

module.exports = router;