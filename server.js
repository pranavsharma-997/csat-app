const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

/* ============================
   🔗 CONNECT TO MONGODB ATLAS
============================ */
mongoose.connect("mongodb+srv://pranavsharma_db_user:Pranav997@cluster0.a0nrzes.mongodb.net/csatDB?retryWrites=true&w=majority")
.then(() => console.log("✅ MongoDB Atlas Connected"))
.catch(err => console.log("❌ Mongo Error:", err));

/* ============================
   📦 SCHEMA + MODEL
============================ */
const ScoreSchema = new mongoose.Schema({
    score: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Score = mongoose.model("Score", ScoreSchema);

/* ============================
   🚀 ROUTES
============================ */

// Test route
app.get("/", (req, res) => {
    res.send("Server is working ✅");
});

// Save score API
app.post("/submit-score", async (req, res) => {
    try {
        const { score } = req.body;

        if (score === undefined) {
            return res.status(400).send("Score is required");
        }

        const newScore = new Score({ score });
        await newScore.save();

        res.send("✅ Score saved to database");
    } catch (error) {
        console.log(error);
        res.status(500).send("❌ Error saving score");
    }
});

/* ============================
   ▶️ START SERVER
============================ */
app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});