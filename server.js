const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

app.use(cors());
app.use(express.json());

const products = require('./data/products.json');
const recommendations = require('./data/recommendations.json');
const education = require('./data/education.json');
const orders = require('./data/orders.json');
const forecasts = require('./data/store1_forecasts.json');
const authRoutes = require('./routes/auth');
const forecastsRoutes = require('./routes/forecasts');
const salesRoutes = require('./routes/sales');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use('/api/auth', authRoutes);
app.use('/api/forecasts', forecastsRoutes);
app.use('/api/sales', salesRoutes);
app.get('/api/products', (req, res) => res.json(products));
app.get('/api/recommendations', (req, res) => res.json(recommendations));
app.get('/api/education', (req, res) => res.json(education));
app.get('/api/orders', (req, res) => res.json(orders));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 