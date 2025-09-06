require('dotenv').config({ debug: false });
const cors = require('cors');
const express = require('express');
const app = express();
const authRoutes = require('./router');
const connectDB = require('./utils/db');
const { errorMiddleware } = require('./middleware/middleware');
const { serveReceiptHandler } = require('./sendMail');

// Game routes are already included in the main router via gameRegistrationRoutes

// ------------------- CORS CONFIG -------------------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "https://veyg-2k25-frontend.onrender.com",   // Your deployed frontend
  "https://veyg-2k25-backend.onrender.com",   // Your deployed backend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman, mobile apps, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
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

// ------------------- RECEIPT SERVING ROUTE -------------------
// Mobile-friendly PDF download route
app.get('/receipts/:filename', serveReceiptHandler);

app.use('/api', authRoutes);

// ------------------- HEALTH CHECK ENDPOINT -------------------
// Health endpoint to fix frontend popup logic
app.get('/api/health', (req, res) => {
  res.json({ ok: true, status: 'healthy', timestamp: new Date().toISOString() });
});

// ------------------- TEST ENDPOINTS -------------------
// Email and sheets test endpoints removed

app.use(errorMiddleware);

// ------------------- PORT -------------------
// Use Render's provided port in production, fallback to 3002 for local development
const PORT = process.env.PORT || 3002;

// ------------------- CONNECT DB & START SERVER -------------------
connectDB().then(() => {
  console.log("✅ Database connected successfully!");
  
  const server = app.listen(PORT, () => {
    if (process.env.NODE_ENV === 'production') {
      console.log(`🚀 Server running on port ${PORT}`);
    } else {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    }
  });

  // Handle server errors
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use. Trying alternative ports...`);
      
      // Try alternative ports
      const alternativePorts = [3003, 3004, 3005, 3006];
      let portIndex = 0;
      
      const tryNextPort = () => {
        if (portIndex < alternativePorts.length) {
          const altPort = alternativePorts[portIndex];
          console.log(`🔄 Trying port ${altPort}...`);
          
          const altServer = app.listen(altPort, () => {
            if (process.env.NODE_ENV === 'production') {
              console.log(`🚀 Server running on port ${altPort}`);
            } else {
              console.log(`🚀 Server running on http://localhost:${altPort}`);
            }
            console.log(`⚠️  Note: Using alternative port ${altPort} instead of ${PORT}`);
          });
          
          altServer.on('error', (altErr) => {
            if (altErr.code === 'EADDRINUSE') {
              console.log(`❌ Port ${altPort} also in use, trying next...`);
              portIndex++;
              tryNextPort();
            } else {
              console.error(`❌ Server error on port ${altPort}:`, altErr.message);
            }
          });
        } else {
          console.error('❌ All alternative ports are in use. Please stop other Node.js processes or use a different port.');
          console.log('💡 To kill processes using these ports, run:');
          console.log('   Get-Process -Name node | Stop-Process -Force');
          process.exit(1);
        }
      };
      
      tryNextPort();
    } else {
      console.error('❌ Server error:', err.message);
    }
  });
  
}).catch((err) => {
  console.error("❌ Failed to connect DB:", err.message);
});

