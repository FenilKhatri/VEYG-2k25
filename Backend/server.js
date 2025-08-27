require('dotenv').config({ debug: false });
const cors = require('cors');
const express = require('express');
const app = express();
const authRoutes = require('./router');
const connectDB = require('./utils/db');
const { errorMiddleware } = require('./middleware/middleware');

// ------------------- CORS CONFIG -------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://veyg-2k25-frontend.onrender.com",   // Your deployed frontend
  "https://veyg-2k25-backend.onrender.com",   // Your deployed backend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, mobile apps, curl)
    if (!origin) return callback(null, true);

<<<<<<< HEAD
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
      "https://veyg-2k25-frontend.onrender.com"
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
=======
    if (allowedOrigins.includes(origin)) {
>>>>>>> b8b179924d32947996d81ec3147d4a142602fe36
      callback(null, true);
    } else {
      console.log(`❌ Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Handle preflight requests

// ------------------- MIDDLEWARE -------------------
app.use(express.json());
app.use('/api', authRoutes);
app.use(errorMiddleware);

// ------------------- PORT -------------------
const PORT = process.env.PORT || 8000;

// ------------------- CONNECT DB & START SERVER -------------------
connectDB().then(() => {
  console.log("✅ Database connected successfully!");
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("❌ Failed to connect DB:", err.message);
});
