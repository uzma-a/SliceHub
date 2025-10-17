import express from "express";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const app = express();
app.use(express.json());

// ✅ Fixed CORS - removed trailing slash
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'https://slice-hub-pizza.vercel.app'  // No trailing slash!
  ],
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ✅ Validate environment variables on startup
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('❌ Missing Razorpay credentials in .env file');
  process.exit(1);
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "ok", 
    message: "Razorpay server is running",
    timestamp: new Date().toISOString()
  });
});

// ✅ Create Order API with validation
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    
    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ 
        error: "Invalid amount", 
        message: "Amount must be greater than 0" 
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Ensure integer, in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        order_type: "pizza_order"
      }
    };

    console.log('Creating order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Order created successfully:', order.id);
    
    res.json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      error: "Error creating order",
      message: error.message 
    });
  }
});

// ✅ Verify Payment Signature API with better logging
app.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ 
        success: false, 
        message: "Missing payment verification data" 
      });
    }

    console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id });

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log('✅ Payment verified successfully');
      res.json({ 
        success: true, 
        message: "Payment verified successfully",
        payment_id: razorpay_payment_id 
      });
    } else {
      console.log('❌ Invalid signature');
      res.status(400).json({ 
        success: false, 
        message: "Invalid signature" 
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error during verification",
      error: error.message 
    });
  }
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Razorpay Key ID: ${process.env.RAZORPAY_KEY_ID?.substring(0, 10)}...`);
});
