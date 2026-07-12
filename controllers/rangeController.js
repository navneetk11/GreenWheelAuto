const db = require('../config/db');

const getAllVehiclesWithRange = async (req, res) => {
    try {
        const [vehicles] = await db.query(`
            SELECT 
                v.id,
                v.brand,
                v.name,
                v.category,
                v.price,
                v.battery_capacity,
                v.image_url,
                v.description,
                vr.range_km,
                vr.city_range,
                vr.highway_range,
                vr.fast_charging,
                vr.charging_time
            FROM vehicles v
            JOIN vehicle_range vr ON v.id = vr.vehicle_id
            ORDER BY vr.range_km DESC
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
                COUNT(CASE WHEN fast_charging = 'Yes' THEN 1 END) as fast_charging_count
            FROM vehicle_range
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
                v.brand,
                v.name,
                v.category,
                v.price,
                vr.range_km,
                vr.fast_charging
            FROM vehicles v
            JOIN vehicle_range vr ON v.id = vr.vehicle_id
            ORDER BY vr.range_km DESC
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

        const [vehicles] = await db.query(`
            SELECT 
                v.id,
                v.brand,
                v.name,
                v.category,
                v.price,
                v.battery_capacity,
                v.image_url,
                v.description,
                vr.range_km,
                vr.city_range,
                vr.highway_range,
                vr.fast_charging,
                vr.charging_time
            FROM vehicles v
            JOIN vehicle_range vr ON v.id = vr.vehicle_id
            ORDER BY vr.range_km DESC
        `);

        if (vehicles.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No vehicles found in database'
            });
        }

        let winterReduction = 0.30;
        if (drivingType === 'City') winterReduction = 0.25;
        else if (drivingType === 'Highway') winterReduction = 0.40;

        const chargerBonus = (homeCharger === 'Yes') ? 0.05 : 0;

        const results = vehicles.map(vehicle => {
            let baseRange = vehicle.range_km;
            if (drivingType === 'City' && vehicle.city_range) {
                baseRange = vehicle.city_range;
            } else if (drivingType === 'Highway' && vehicle.highway_range) {
                baseRange = vehicle.highway_range;
            }

            const winterRange = Math.round(baseRange * (1 - winterReduction + chargerBonus));
            
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
                vehicle_id: vehicle.id,
                brand: vehicle.brand,
                name: vehicle.name,
                category: vehicle.category,
                price: vehicle.price,
                battery_capacity: vehicle.battery_capacity,
                image_url: vehicle.image_url || null,
                description: vehicle.description || null,
                range_km: vehicle.range_km,
                city_range: vehicle.city_range,
                highway_range: vehicle.highway_range,
                winter_range: winterRange,
                fast_charging: vehicle.fast_charging,
                charging_time: vehicle.charging_time,
                suitability,
                status,
                message,
                recommendation
            };
        });

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