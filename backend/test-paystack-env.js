// test-paystack-env.js
const axios = require("axios");

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY; // from .env
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

if (!PAYSTACK_SECRET_KEY || !PAYSTACK_PUBLIC_KEY) {
  console.error("❌ Missing Paystack keys in environment variables!");
  process.exit(1);
}

const testPaystack = async () => {
  console.log("🔹 Testing Paystack environment...");

  try {
    // Step 1: Initialize a dummy transaction
    console.log("1️⃣ Initializing dummy transaction...");
    const initRes = await axios.post(
      process.env.PAYSTACK_INIT_URL || "https://api.paystack.co/transaction/initialize",
      {
        email: "testuser@example.com",
        amount: 5000, // 50 NGN in Kobo
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Initialization response:", initRes.data);

    const reference = initRes.data.data.reference;

    // Step 2: Verify the dummy transaction
    console.log("2️⃣ Verifying dummy transaction...");
    const verifyRes = await axios.get(
      (process.env.PAYSTACK_VERIFY_URL || "https://api.paystack.co/transaction/verify/:reference").replace(
        ":reference",
        reference
      ),
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    console.log("✅ Verification response:", verifyRes.data);

    console.log("🎉 Paystack environment looks good!");
  } catch (error) {
    if (error.response) {
      console.error("❌ Paystack API error:", error.response.data);
    } else {
      console.error("❌ Network or config error:", error.message);
    }
  }
};

// Run the test
testPaystack();