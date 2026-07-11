const express = require('express');
const router = express.Router();

// placeholder
router.get('/', (req, res) => {
    res.json({ message: 'Range routes working' });
});

module.exports = router;
