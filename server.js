const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));
app.use('/images', express.static(path.join(__dirname, 'public/images')));
// Routes
app.use('/api/vehicles', require('./routes/vehicleRoutes'));
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/cart',     require('./routes/cartRoutes'));
app.use('/api/range',    require('./routes/rangeRoutes'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'catalogue.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});