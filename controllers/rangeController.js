const db = require('../config/db');

// ===== GET ALL VEHICLES WITH RANGE DATA =====
const getAllVehiclesWithRange = async (req, res) => {
    try {
        const [vehicles] = await db.query(`
            SELECT 
                vid,
                name,
                description,
                brand,
                model,
                year,
                shape,
                condition_type,
                mileage,
                price,
                quantity,
                range_km,
                range_winter_km,
                exterior_color,
                interior_color,
                interior_fabric,
                charging_speed,
                drive_type,
                has_history_report,
                accident_reported,
                is_hot_deal,
                image_url
            FROM Item
            ORDER BY range_km DESC
        `);

        res.status(200).json({
            success: true,
            count: vehicles.length,
            data: vehicles
        });
    } catch (error) {
        console.error('Error fetching vehicles:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch vehicles',
            error: error.message
        });
    }
};

// ===== GET RANGE STATISTICS =====
const getRangeStatistics = async (req, res) => {
    try {
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total_vehicles,
                AVG(range_km) as avg_range,
                MIN(range_km) as min_range,
                MAX(range_km) as max_range,
                COUNT(CASE WHEN charging_speed = 'Fast' THEN 1 END) as fast_charging_count
            FROM Item
            WHERE range_km IS NOT NULL
        `);

        res.status(200).json({
            success: true,
            data: stats[0]
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch statistics',
            error: error.message
        });
    }
};

// ===== GET TOP RANGE VEHICLES =====
const getTopRangeVehicles = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 5;
        const [vehicles] = await db.query(`
            SELECT 
                vid,
                brand,
                name,
                model,
                price,
                range_km,
                range_winter_km,
                charging_speed
            FROM Item
            WHERE range_km IS NOT NULL
            ORDER BY range_km DESC
            LIMIT ?
        `, [limit]);

        res.status(200).json({
            success: true,
            count: vehicles.length,
            data: vehicles
        });
    } catch (error) {
        console.error('Error fetching top vehicles:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch top vehicles',
            error: error.message
        });
    }
};

// ===== RANGE SUITABILITY CHECKER =====
const checkRangeSuitability = async (req, res) => {
    try {
        const { dailyCommute, drivingType, homeCharger } = req.body;

        // Validate required fields
        if (!dailyCommute || !drivingType) {
            return res.status(400).json({
                success: false,
                message: 'Daily commute and driving type are required'
            });
        }

        const commuteKm = parseFloat(dailyCommute);
        if (isNaN(commuteKm) || commuteKm <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid daily commute distance'
            });
        }

        // Get all vehicles with range data from Item table
        const [vehicles] = await db.query(`
            SELECT 
                vid,
                name,
                brand,
                model,
                price,
                range_km,
                range_winter_km,
                charging_speed,
                shape,
                drive_type
            FROM Item
            WHERE range_km IS NOT NULL
            ORDER BY range_km DESC
        `);

        if (vehicles.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No vehicles found in database'
            });
        }

        // Winter range reduction based on driving type
        let winterReduction = 0.30; // Mixed
        if (drivingType === 'City') winterReduction = 0.25;
        else if (drivingType === 'Highway') winterReduction = 0.40;

        // Home charger bonus
        const chargerBonus = (homeCharger === 'Yes') ? 0.05 : 0;

        // Calculate results for each vehicle
        const results = vehicles.map(vehicle => {
            // Use winter range if available, otherwise calculate from EPA range
            let baseRange = vehicle.range_winter_km || vehicle.range_km;
            let winterRange = Math.round(baseRange * (1 - winterReduction + chargerBonus));
            
            // Suitability check
            let suitability, status, message, recommendation;

            if (winterRange >= commuteKm * 1.3) {
                suitability = 'SUITABLE';
                status = '✅';
                message = 'This vehicle can handle your daily commute comfortably, even in winter conditions.';
                recommendation = 'Highly recommended';
            } else if (winterRange >= commuteKm) {
                suitability = 'BORDERLINE';
                status = '⚠️';
                message = 'This vehicle might work for your commute, but you\'ll need to charge frequently, especially in winter.';
                recommendation = 'Consider with caution';
            } else {
                suitability = 'NOT RECOMMENDED';
                status = '❌';
                message = 'This vehicle likely cannot handle your daily commute, especially in cold weather.';
                recommendation = 'Not recommended for your needs';
            }

            return {
                vid: vehicle.vid,
                name: vehicle.name,
                brand: vehicle.brand,
                model: vehicle.model,
                price: vehicle.price,
                shape: vehicle.shape,
                drive_type: vehicle.drive_type,
                range_km: vehicle.range_km,
                range_winter_km: vehicle.range_winter_km,
                winter_range: winterRange,
                charging_speed: vehicle.charging_speed,
                suitability,
                status,
                message,
                recommendation
            };
        });

        // Sort by suitability (SUITABLE first, then BORDERLINE, then NOT RECOMMENDED)
        const sortedResults = results.sort((a, b) => {
            const order = { 'SUITABLE': 1, 'BORDERLINE': 2, 'NOT RECOMMENDED': 3 };
            return order[a.suitability] - order[b.suitability];
        });

        res.status(200).json({
            success: true,
            count: sortedResults.length,
            user_inputs: {
                daily_commute: commuteKm,
                driving_type: drivingType,
                home_charger: homeCharger || 'No'
            },
            data: sortedResults
        });

    } catch (error) {
        console.error('Error checking range suitability:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to check range suitability',
            error: error.message
        });
    }
};

module.exports = {
    getAllVehiclesWithRange,
    getRangeStatistics,
    getTopRangeVehicles,
    checkRangeSuitability
};