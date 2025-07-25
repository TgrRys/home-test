// Set test environment
process.env.NODE_ENV = 'test';

// Load environment variables from .env file
require('dotenv').config();

// Set up any global test configurations here
jest.setTimeout(10000); // 10 second timeout
