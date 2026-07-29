const reviewDAO = require('../dao/reviewDAO');

// GET /api/reviews/:vid
async function getReviews(req, res) {
    try {
        const { vid } = req.params;

        const reviews = await reviewDAO.getReviewsByVehicle(vid);
        const summary = await reviewDAO.getAverageRating(vid);

        res.json({
            averageRating: summary.averageRating || 0,
            totalReviews: summary.totalReviews || 0,
            reviews
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to load reviews.'
        });
    }
}

// POST /api/reviews
async function addReview(req, res) {
    try {
        const { vid, rating, comment } = req.body;

        if (!vid || !rating) {
            return res.status(400).json({
                message: 'Vehicle and rating are required.'
            });
        }

        await reviewDAO.addReview(
            req.user.id,
            vid,
            rating,
            comment
        );

        res.status(201).json({
            message: 'Review added successfully.'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Failed to add review.'
        });
    }
}

module.exports = {
    getReviews,
    addReview
};