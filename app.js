const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./api/routes/User'); // Make sure to adjust the path as needed
const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/', userRoutes);
// Connect to MongoDB
mongoose.connect('mongodb+srv://salonidoshi17:jHayEF4pHh0QIz3j@cluster0.nlnjiwe.mongodb.net/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Start the server
const PORT = 1337;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
