const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const { domainRoutes } = require('./routes'); // Import routes


const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 4000;
const MONGODB_URI = 'mongodb://127.0.0.1:27017/whois';

const startServer = async () => {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Use routes
    app.use(domainRoutes);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Could not connect to MongoDB...', err);
    process.exit(1); // Exit the process with an error code
  }
};

startServer();

module.exports = app;
