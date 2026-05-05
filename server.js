const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ CORS FIX (IMPORTANT FOR NETLIFY)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://pranavsharma_db_user:Pranav997@cluster0.a0nrzes.mongodb.net/csatDB?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ Mongo Error:", err));

// 👤 Agents (ADD MORE ANYTIME)
const agents = {
  "pranav.sharma@truckx.com": "Pranav Sharma",
  "Pranav.sharma@truckx.com": "Pranav Sharma",

  "aakash.mittal@truckx.com": "Aakash Mittaliya",
  "abhisheak.sharma@truckx.com": "Abhisheak Sharma",
  "abhishek.jeste@truckx.com": "Abhishek Jeste"
};

// 📦 Schema
const feedbackSchema = new mongoose.Schema({
  score: Number,
  email: String,
  name: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

// 🚀 Submit API
app.post("/submit-score", async (req, res) => {
  try {
    const { score, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const name = agents[email] || "Unknown";

    await Feedback.create({
      score,
      email,
      name
    });

    res.json({ message: "Saved successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🧪 Test route
app.get("/", (req, res) => {
  res.send("Server working 🚀");
});

// 🌐 Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});