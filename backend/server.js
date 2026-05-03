const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const seedData = require('./seeder');

// Load env vars
dotenv.config();

// Connect to database and seed logic moved to startServer

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Set security headers
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Route files
const auth = require('./routes/authRoutes');
const projects = require('./routes/projectRoutes');
const tasks = require('./routes/taskRoutes');
const users = require('./routes/userRoutes');
const dashboard = require('./routes/dashboardRoutes');

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/projects', projects);
app.use('/api/v1/tasks', tasks);
app.use('/api/v1/users', users);
app.use('/api/v1/dashboard', dashboard);

// Base route
app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database first
    await connectDB();
    
    // Seed data
    await seedData();

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
