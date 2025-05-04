// server.js
const express    = require('express');
const cors       = require('cors');
require('dotenv').config();

const sequelize     = require('./config/db');
const authRoutes    = require('./routes/authRoutes');
const categoryRoutes= require('./routes/categoryRoutes');
const threadRoutes  = require('./routes/threadRoutes');
const pollRoutes    = require('./routes/pollRoutes');

const app = express();
const userRoutes = require('./routes/userRoutes');

// CORS — only allow your React frontend and pass auth headers
app.use(cors({
  origin: 'http://localhost:8080',     // your React dev server
  credentials: true,                   // allow cookies / Authorization header
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// JSON request bodies
app.use(express.json());

// Mount API routes
app.use('/api/auth',       authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/threads',    threadRoutes);
app.use('/api/polls',      pollRoutes);
app.use('/api/users',      userRoutes);
// Start listening only after DB is authenticated
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connection established.');
    // Optionally sync your models:
    // await sequelize.sync({ alter: true });
  } catch (err) {
    console.error('❌ Unable to connect to DB:', err.message);
  }
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
