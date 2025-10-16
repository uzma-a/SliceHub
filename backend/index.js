import express from "express";
import Razorpay from "razorpay";
import cors from "cors";
import dotenv from "dotenv";
import crypto from "crypto";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
app.use(express.json());

// In your backend server.js
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://slice-hub-pizza.vercel.app/'],
  credentials: true
}));

// ✅ MySQL Database Connection Pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "pizza_orders",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Create tables if they don't exist
async function initializeDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(100) UNIQUE,
        customer_name VARCHAR(255) NOT NULL,
        customer_phone VARCHAR(20) NOT NULL,
        customer_email VARCHAR(255),
        customer_address TEXT NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        payment_method VARCHAR(50) NOT NULL,
        payment_id VARCHAR(255),
        payment_status VARCHAR(50) DEFAULT 'pending',
        order_status VARCHAR(50) DEFAULT 'placed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id VARCHAR(100),
        item_name VARCHAR(255) NOT NULL,
        item_price DECIMAL(10, 2) NOT NULL,
        quantity INT NOT NULL,
        subtotal DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE
      )
    `);

    console.log("✅ Database tables initialized");
  } catch (error) {
    console.error("❌ Database initialization error:", error);
  }
}

initializeDatabase();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ 1️⃣ Create Order API
app.post("/create-order", async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: amount * 100, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating order");
  }
});

// ✅ 2️⃣ Verify Payment Signature API
app.post("/verify-payment", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      res.json({ success: true, message: "Payment verified successfully" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Verification error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ 3️⃣ Save Order to Database
app.post("/save-order", async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    const {
      customerDetails,
      cart,
      totalAmount,
      paymentData,
      paymentMethod
    } = req.body;

    // Generate unique order ID
    const orderId = `ORD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Start transaction
    await connection.beginTransaction();

    // Insert order
    await connection.query(
      `INSERT INTO orders 
       (order_id, customer_name, customer_phone, customer_email, customer_address, 
        total_amount, payment_method, payment_id, payment_status, order_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        orderId,
        customerDetails.name,
        customerDetails.phone,
        customerDetails.email || null,
        customerDetails.address,
        totalAmount,
        paymentMethod,
        paymentData?.razorpay_payment_id || null,
        paymentMethod === 'cod' ? 'pending' : 'paid',
        'placed'
      ]
    );

    // Insert order items
    for (const item of cart) {
      await connection.query(
        `INSERT INTO order_items 
         (order_id, item_name, item_price, quantity, subtotal)
         VALUES (?, ?, ?, ?, ?)`,
        [
          orderId,
          item.name,
          item.price,
          item.quantity,
          item.price * item.quantity
        ]
      );
    }

    // Commit transaction
    await connection.commit();

    res.json({ 
      success: true, 
      message: "Order saved successfully",
      orderId: orderId
    });

  } catch (error) {
    await connection.rollback();
    console.error("Error saving order:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error saving order" 
    });
  } finally {
    connection.release();
  }
});

// ✅ 4️⃣ Get All Orders (Optional - for admin panel)
app.get("/orders", async (req, res) => {
  try {
    const [orders] = await pool.query(`
      SELECT o.*, 
             GROUP_CONCAT(
               CONCAT(oi.item_name, ' x', oi.quantity, ' (₹', oi.item_price, ')')
               SEPARATOR ', '
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.order_id = oi.order_id
      GROUP BY o.order_id
      ORDER BY o.created_at DESC
    `);
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
});

// ✅ 5️⃣ Get Single Order Details
app.get("/orders/:orderId", async (req, res) => {
  try {
    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE order_id = ?",
      [req.params.orderId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    const [items] = await pool.query(
      "SELECT * FROM order_items WHERE order_id = ?",
      [req.params.orderId]
    );

    res.json({ order: orders[0], items });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Error fetching order" });
  }
});

app.listen(process.env.PORT || 5000, () =>
  console.log(`Server running on port ${process.env.PORT || 5000}`)
);
