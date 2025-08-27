require('dotenv').config({ debug: false });
const cors = require('cors');
const express = require('express');
const app = express();
const authRoutes = require('./router');
const connectDB = require('./utils/db');
const { errorMiddleware } = require('./middleware/middleware');

const corsOption = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174"
    ];

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS",
  credentials: true,
  optionsSuccessStatus: 200
}

app.use(cors(corsOption));

app.use(express.json());

app.use('/api', authRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;

// Better error handling for database connection
connectDB().then(() => {
  console.log('Database connected successfully!');
  app.listen(PORT);
})