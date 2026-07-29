const db = require('../config/db');

// Get all reviews for a vehicle
async function getReviewsByVehicle(vid) {
    const [rows] = await db.query(
        `SELECT
            r.id,
            r.rating,
            r.comment,
            r.created_at,
            u.fname,
            u.lname
        FROM Reviews r
        JOIN Users u ON r.user_id = u.id
        WHERE r.vid = ?
        ORDER BY r.created_at DESC`,
        [vid]
    );

    return rows;
}

// Get average rating
async function getAverageRating(vid) {
    const [rows] = await db.query(
        `SELECT
            ROUND(AVG(rating),1) AS averageRating,
            COUNT(*) AS totalReviews
        FROM Reviews
        WHERE vid = ?`,
        [vid]
    );

    return rows[0];
}

// Add review
async function addReview(userId, vid, rating, comment) {
    const [result] = await db.query(
        `INSERT INTO Reviews
        (user_id, vid, rating, comment)
        VALUES (?, ?, ?, ?)`,
        [userId, vid, rating, comment]
    );

    return result.insertId;
}

module.exports = {
    getReviewsByVehicle,
    getAverageRating,
    addReview
};