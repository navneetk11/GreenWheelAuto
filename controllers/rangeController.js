const { promisePool } = require('../config/db');

// Get all range data
exports.getAllRanges = async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT vr.*, v.name, v.brand, v.category 
            FROM vehicle_range vr
            JOIN vehicles v ON vr.vehicle_id = v.id
            ORDER BY vr.range_km DESC
        `);
        
        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching ranges:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch range data',
            error: error.message
        });
    }
};

// Get range by vehicle ID
exports.getRangeByVehicleId = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await promisePool.query(
            'SELECT * FROM vehicle_range WHERE vehicle_id = ?',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No range data found for vehicle ID: ${id}`
            });
        }

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching range:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch range data',
            error: error.message
        });
    }
};

// Get vehicles with range above certain value
exports.getVehiclesWithRangeAbove = async (req, res) => {
    try {
        const { minRange } = req.query;
        if (!minRange) {
            return res.status(400).json({
                success: false,
                message: 'Minimum range value is required'
            });
        }

        const [rows] = await promisePool.query(`
            SELECT vr.*, v.name, v.brand, v.category 
            FROM vehicle_range vr
            JOIN vehicles v ON vr.vehicle_id = v.id
            WHERE vr.range_km >= ?
            ORDER BY vr.range_km DESC
        `, [parseInt(minRange)]);

        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching vehicles with range above:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vehicles',
            error: error.message
        });
    }
};

// Get vehicles with fast charging
exports.getVehiclesWithFastCharging = async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT vr.*, v.name, v.brand, v.category 
            FROM vehicle_range vr
            JOIN vehicles v ON vr.vehicle_id = v.id
            WHERE vr.fast_charging = 'Yes'
            ORDER BY vr.range_km DESC
        `);

        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching fast charging vehicles:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch fast charging vehicles',
            error: error.message
        });
    }
};

// Get range statistics
exports.getRangeStatistics = async (req, res) => {
    try {
        const [rows] = await promisePool.query(`
            SELECT 
                COUNT(*) as total_vehicles,
                AVG(range_km) as avg_range,
                MIN(range_km) as min_range,
                MAX(range_km) as max_range,
                COUNT(CASE WHEN fast_charging = 'Yes' THEN 1 END) as fast_charging_count
            FROM vehicle_range
        `);

        res.status(200).json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching range statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch range statistics',
            error: error.message
        });
    }
};

// Get top range vehicles
exports.getTopRangeVehicles = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const [rows] = await promisePool.query(`
            SELECT vr.*, v.name, v.brand, v.category, v.price
            FROM vehicle_range vr
            JOIN vehicles v ON vr.vehicle_id = v.id
            ORDER BY vr.range_km DESC
            LIMIT ?
        `, [limit]);

        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching top range vehicles:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch top range vehicles',
            error: error.message
        });
    }
};

// Search range with filters
exports.searchRange = async (req, res) => {
    try {
        const { brand, minRange, maxRange, fastCharging, category } = req.query;
        let query = `
            SELECT vr.*, v.name, v.brand, v.category, v.price 
            FROM vehicle_range vr
            JOIN vehicles v ON vr.vehicle_id = v.id
            WHERE 1=1
        `;
        const values = [];

        if (brand) {
            query += ' AND v.brand LIKE ?';
            values.push(`%${brand}%`);
        }

        if (minRange) {
            query += ' AND vr.range_km >= ?';
            values.push(parseInt(minRange));
        }

        if (maxRange) {
            query += ' AND vr.range_km <= ?';
            values.push(parseInt(maxRange));
        }

        if (fastCharging) {
            query += ' AND vr.fast_charging = ?';
            values.push(fastCharging);
        }

        if (category) {
            query += ' AND v.category = ?';
            values.push(category);
        }

        query += ' ORDER BY vr.range_km DESC';

        const [rows] = await promisePool.query(query, values);

        res.status(200).json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error searching range:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to search range data',
            error: error.message
        });
    }
};

// Update range data
exports.updateRange = async (req, res) => {
    try {
        const { id } = req.params;
        const { range_km, city_range, highway_range, fast_charging, charging_time } = req.body;

        if (!range_km) {
            return res.status(400).json({
                success: false,
                message: 'Range (km) is required'
            });
        }

        // Check if vehicle exists
        const [existing] = await promisePool.query(
            'SELECT * FROM vehicle_range WHERE vehicle_id = ?',
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: `No range data found for vehicle ID: ${id}`
            });
        }

        const [result] = await promisePool.query(
            `UPDATE vehicle_range 
             SET range_km = ?, city_range = ?, highway_range = ?, 
                 fast_charging = ?, charging_time = ?, updated_at = NOW()
             WHERE vehicle_id = ?`,
            [range_km, city_range || null, highway_range || null, 
             fast_charging || 'No', charging_time || null, id]
        );

        res.status(200).json({
            success: true,
            message: `Range data updated successfully for vehicle ID: ${id}`,
            data: result
        });
    } catch (error) {
        console.error('Error updating range:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update range data',
            error: error.message
        });
    }
};