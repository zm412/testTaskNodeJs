
const dotenv = require('dotenv');
const path = require('path');
require('dotenv').config()

module.exports= {
  MONGO_URI_FREECAMP : process.env.MONGO_URI_FREECAMP,
  NODE_ENV: process.env.NODE_ENV
}
