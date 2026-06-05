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

const feedbackSchema = new mongoose.Schema(
  {
    agentName: String,
    agentEmail: String,
    cxId: String,
    rating: Number,
    comment: String,
    country: String,
    submittedAtIST: String,
    isBot: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

app.get("/", (req, res) => {
  res.send("CSAT backend is running");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Backend is alive",
    time: new Date()
  });
});

app.post("/submit", async (req, res) => {
  try {
    const {
      agentName,
      agentEmail,
      cxId,
      rating,
      comment,
      country,
      submittedAtIST
    } = req.body;

    if (!agentEmail || !rating) {
      return res.status(400).json({
        success: false,
        message: "Agent email and rating are required"
      });
    }

    const feedback = new Feedback({
      agentName,
      agentEmail,
      cxId: cxId || "",
      rating,
      comment: comment || "",
      country: country || "Unknown",
      submittedAtIST:
        submittedAtIST ||
        new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        }),
      isBot: false
    });

    await feedback.save();

    res.json({
      success: true,
      message: "Feedback submitted successfully"
    });
  } catch (error) {
    console.log("Submit Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

app.post("/bot-feedback", async (req, res) => {
  try {
    const { secret } = req.body;

    if (secret !== "truckx-bot-12345") {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const feedback = new Feedback({
      agentName: "Pranav Sharma",
      agentEmail: "pranav.sharma@truckx.com",
      cxId: "7807253881",
      rating: 5,
      comment: "BOT_KEEP_ALIVE",
      country: "Bot",
      submittedAtIST: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
      }),
      isBot: true
    });

    await feedback.save();

    res.status(200).json({
      success: true,
      message: "Bot feedback submitted"
    });
  } catch (error) {
    console.log("Bot Feedback Error:", error);

    res.status(500).json({
      success: false,
      message: "Bot failed"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});