require("dotenv").config({ debug: false });
const cors = require("cors");
const express = require("express");
const app = express();
const authRoutes = require("./router");
const connectDB = require("./utils/db");
const { errorMiddleware } = require("./middleware/middleware");

// ✅ Correct CORS configuration
const allowedOrigins = [
  "http://localhost:5173",   // Local frontend (Vite)
  "http://localhost:5174",   // Alternate local frontend
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://veyg-2k25-frontend.onrender.com", // ✅ Your frontend Render URL
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (e.g., mobile apps, Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error(`❌ CORS blocked for origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// ✅ Parse JSON payloads
app.use(express.json());

// ✅ API Routes
app.use("/api", authRoutes);

// ✅ Error Middleware
app.use(errorMiddleware);

// ✅ Port config
const PORT = process.env.PORT || 8000;

// ✅ Connect to MongoDB and start the server
connectDB()
  .then(() => {
    console.log("✅ Database connected successfully!");
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  });
