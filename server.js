const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const contactmsgRouter = require("./routes/contactus");

dotenv.config();

const app = express();

// ✅ Allow both local and deployed frontend URLs
const allowedOrigins = [
    "http://localhost:5173",  // Local dev
    "https://your-frontend.vercel.app" // Replace with your deployed frontend URL
];
app.use(cors({
    origin: function(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS not allowed"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow all needed headers
}));


app.use(express.json());

// ✅ Routes
app.get("/", (req, res) => res.json({ message: "Home Page" }));
app.use("/contactus", contactmsgRouter);

// ✅ MongoDB + Server start
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT} and connected to DB`);
        });
    })
    .catch((error) => console.error("❌ MongoDB connection error:", error));
