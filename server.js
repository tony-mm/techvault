const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { initializeDB } = require('./backend/config/dbAdapter');

// Models (for bootstrapping/initial data if needed)
const productRoutes = require('./backend/routes/productRoutes');
const heroRoutes = require('./backend/routes/heroRoutes');
const settingsRoutes = require('./backend/routes/settingsRoutes');
const authRoutes = require('./backend/routes/authRoutes');
const { protect } = require('./backend/middleware/authMiddleware');

const path = require('path');

dotenv.config();
initializeDB();

const app = express();

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // For local development/base64 images
}));
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Higher limit for base64 images
app.use(morgan('dev'));

const orderRoutes = require('./backend/routes/orderRoutes');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/hero-slides', heroRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/orders', orderRoutes);

// Static Files
app.use(express.static(__dirname));

// Root route - serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
