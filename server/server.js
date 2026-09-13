import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Order from "./models/Order.js";
import Moment from "./models/Moment.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "By The Brew API is running" });
});

// ---------------- ORDERS ----------------

app.post("/api/orders", async (req, res) => {
  try {
    const { customer, items, total } = req.body;

    if (!customer?.name?.trim() || !customer?.phone?.trim()) {
      return res.status(400).json({ message: "Name and phone number are required." });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "At least one order item is required." });
    }

    const order = await Order.create({
      customer: {
        name: customer.name.trim(),
        phone: customer.phone.trim(),
        orderType: customer.orderType || "Dine-in",
        tableNo: customer.tableNo?.trim() || "",
      },
      items,
      total,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("POST /api/orders:", error);
    res.status(500).json({ message: "Could not save the order." });
  }
});

app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("GET /api/orders:", error);
    res.status(500).json({ message: "Could not fetch orders." });
  }
});

app.patch("/api/orders/:id/status", async (req, res) => {
  try {
    const allowedStatuses = [
      "Pending",
      "Preparing",
      "Ready",
      "Completed",
      "Cancelled",
    ];

    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status." });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.json(order);
  } catch (error) {
    console.error("PATCH /api/orders/:id/status:", error);
    res.status(500).json({ message: "Could not update order status." });
  }
});

// ---------------- BREW MOMENTS ----------------

app.post("/api/moments", async (req, res) => {
  try {
    const { title, name, image } = req.body;

    if (!title?.trim() || !image) {
      return res.status(400).json({ message: "Title and image are required." });
    }

    const moment = await Moment.create({
      title: title.trim(),
      name: name?.trim() || "A Brew Lover",
      image,
    });

    res.status(201).json({
      message: "Moment saved successfully",
      moment,
    });
  } catch (error) {
    console.error("POST /api/moments:", error);
    res.status(500).json({ message: "Could not save the moment." });
  }
});

// Only the 5 newest moments are returned to the website.
app.get("/api/moments", async (req, res) => {
  try {
    const moments = await Moment.find().sort({ createdAt: -1 }).limit(5);
    res.json(moments);
  } catch (error) {
    console.error("GET /api/moments:", error);
    res.status(500).json({ message: "Could not fetch moments." });
  }
});

app.delete("/api/moments/:id", async (req, res) => {
  try {
    const moment = await Moment.findByIdAndDelete(req.params.id);

    if (!moment) {
      return res.status(404).json({ message: "Moment not found." });
    }

    res.json({ message: "Moment deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/moments/:id:", error);
    res.status(500).json({ message: "Could not delete the moment." });
  }
});

// ---------------- DATABASE ----------------

async function startServer() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI is missing. Create server/.env first.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected");

    app.listen(PORT, () => {
      console.log(`By The Brew API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

startServer();
