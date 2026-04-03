const express = require('express');
const { initializePayment, handleWebhook } = require('../controllers/paystackController');
const router = express.Router();

router.post('/paystack/initialize', initializePayment);
router.post('/paystack/webhook', handleWebhook);

module.exports = router;