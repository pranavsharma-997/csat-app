const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ✅ CORS (important for Netlify)
app.use(cors());
app.use(express.json());

// ✅ MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://pranavsharma_db_user:Pranav997@cluster0.a0nrzes.mongodb.net/csatDB?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ Mongo Error:", err));

// 👤 Agents
const agents = {
  "Pranav.sharma@truckx.com": "Pranav Sharma",
  "pranav.sharma@truckx.com": "Pranav Sharma",

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

// 🚀 API
app.post("/submit-score", async (req, res) => {
  try {
    const { score, email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const name = agents[email] || "Unknown";

    await Feedback.create({ score, email, name });

    res.status(200).json({ success: true });

  } catch (err) {
    console.log("❌ ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🧪 Test
app.get("/", (req, res) => {
  res.send("Server working 🚀");
});

// 🌐 Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});