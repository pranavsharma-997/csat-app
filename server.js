require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((error) => {
    console.log("❌ MongoDB Error:", error);
  });

const feedbackSchema = new mongoose.Schema({
  email: String,
  rating: Number,
  comment: String
});

const Feedback = mongoose.model("Feedback", feedbackSchema);

app.get("/", (req, res) => {
  res.send("CSAT backend is running");
});

app.post("/submit", async (req, res) => {
  try {
    const { email, rating, comment } = req.body;

    const feedback = new Feedback({
      email,
      rating,
      comment
    });

    await feedback.save();

    res.json({
      success: true,
      message: "Feedback submitted successfully"
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});