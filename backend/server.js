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

// Base route (health check / deployment smoke test)
app.get('/', (req, res) => {
  res.type('text/plain').send('API is running');
});

const PORT = Number(process.env.PORT) || 5000;
/** Railway/container platforms need to listen on all interfaces, not localhost-only */
const HOST = process.env.HOST || '0.0.0.0';

const startServer = async () => {
  try {
    await connectDB();
    await seedData();

    app.listen(PORT, HOST, () => {
      console.log(`Server running on http://${HOST}:${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('[Startup failed] Unable to connect to DB or bootstrap server.');
    console.error('[Startup failed]', error && error.stack ? error.stack : error);
    process.exit(1);
  }
};

startServer();
