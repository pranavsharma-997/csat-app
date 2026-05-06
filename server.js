const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// ✅ Schema
const feedbackSchema = new mongoose.Schema({
  email: String,
  score: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// ✅ Model
const Feedback = mongoose.model("Feedback", feedbackSchema);

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("Server working 🚀");
});

// ✅ Submit Route
app.post("/submit-score", async (req, res) => {

  try {

    const { email, score } = req.body;

    const newFeedback = new Feedback({
      email,
      score
    });

    await newFeedback.save();

    res.json({
      success: true
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false
    });
  }
});
  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Error saving feedback"
    });
  }
});

// ✅ Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});