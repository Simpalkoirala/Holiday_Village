import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import connectDB from "./config/db.js"; // NEW: DB logic separated into db.js
import authRoutes from "./routes/auth.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);


app.use(express.static(path.join(__dirname, "/Front_End/build")));

app.get("*", (req, res) => {
  res.senFile(path.resolve(__dirname, "Front_End", "public", "index.html"));
})


// Health check route
app.get("/", (req, res) => {
  res.send("✅ API is working fine!");
});

// Start server only after DB is connected
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err);
    process.exit(1); // Exit if DB connection fails
  });
