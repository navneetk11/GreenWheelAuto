const db = require('../config/db');

// UC03 — Browse all vehicles
const getAllVehicles = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM Item');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// UC06 — Vehicle detail
const getVehicleById = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM Item WHERE vid = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// UC05 — Filter vehicles (with optional sorting)
const filterVehicles = async (req, res) => {
    try {
        const { brand, shape, year, accident_reported, sortBy, sortOrder } = req.query;
        
        let query = 'SELECT * FROM Item WHERE 1=1';
        const params = [];

        if (brand) {
            query += ' AND brand = ?';
            params.push(brand);
        }
        if (shape) {
            query += ' AND shape = ?';
            params.push(shape);
        }
        if (year) {
            query += ' AND year = ?';
            params.push(year);
        }
        if (accident_reported !== undefined && accident_reported !== '') {
            query += ' AND accident_reported = ?';
            params.push(accident_reported === 'true' ? 1 : 0);
        }

        // Apply sorting if provided
        const allowedFields = ['price', 'mileage', 'year'];
        const allowedOrders = ['asc', 'desc'];
        if (sortBy && allowedFields.includes(sortBy)) {
            const order = allowedOrders.includes(sortOrder?.toLowerCase()) 
                ? sortOrder 
                : 'asc';
            query += ` ORDER BY ${sortBy} ${order}`;
        }

        const [rows] = await db.query(query, params);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// UC04 — Sort vehicles
const sortVehicles = async (req, res) => {
    try {
        const { by, order } = req.query;

        const allowedFields = ['price', 'mileage', 'year'];
        const allowedOrders = ['asc', 'desc'];

        const sortField = allowedFields.includes(by) ? by : 'price';
        const sortOrder = allowedOrders.includes(order?.toLowerCase())
            ? order
            : 'asc';

        const [rows] = await db.query(
            `SELECT * FROM Item ORDER BY ${sortField} ${sortOrder}`
        );
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = {
    getAllVehicles,
    getVehicleById,
    filterVehicles,
    sortVehicles
};