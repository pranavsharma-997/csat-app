const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ================================
// MongoDB Connection
// ================================
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log("✅ MongoDB Connected");
})
.catch((err) => {
  console.log("❌ MongoDB Error:", err);
});

// ================================
// Feedback Schema
// ================================
const feedbackSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },

  score: {
    type: Number,
    required: true
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// IMPORTANT:
// NO unique: true anywhere

// ================================
// Feedback Model
// ================================
const Feedback = mongoose.model("Feedback", feedbackSchema);

// ================================
// Home Route
// ================================
app.get("/", (req, res) => {
  res.send("🚀 Server working");
});

// ================================
// Submit Feedback Route
// ================================
app.post("/submit-score", async (req, res) => {

  try {

    const { email, score } = req.body;

    // Validation
    if (!email || score === undefined) {
      return res.status(400).json({
        success: false,
        message: "Email and score required"
      });
    }

    // ALWAYS CREATE NEW DOCUMENT
    const newFeedback = new Feedback({
      email,
      score
    });

    await newFeedback.save();

    console.log("✅ Feedback Saved:", email, score);

    res.status(200).json({
      success: true,
      message: "Feedback submitted successfully"
    });

  } catch (error) {

    console.log("❌ Error saving feedback:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// ================================
// Get All Feedbacks (Optional)
// ================================
app.get("/feedbacks", async (req, res) => {

  try {

    const feedbacks = await Feedback.find().sort({ createdAt: -1 });

    res.json(feedbacks);

  } catch (error) {

    res.status(500).json({
      success: false
    });
  }
});

// ================================
// Start Server
// ================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});