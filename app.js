const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://salonidoshi17:jHayEF4pHh0QIz3j@cluster0.nlnjiwe.mongodb.net/socialmedia')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));