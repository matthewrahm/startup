// Import required dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const axios = require('axios');
require('dotenv').config();

// Import the main server file
const server = require('./server');

// Export the server for potential use with testing frameworks or direct import
module.exports = server;