const express = require('express');
const Pool = require('../models/pool');

const router = express.Router();

// Validate and connect to a pool
router.post('/connect', async (req, res) => {
    const { poolId, userId } = req.body;

    try {
        const pool = await Pool.findOne({ where: { poolId } });

        if (!pool) {
            return res.status(404).json({ message: 'Pool not found' });
        }

        if (pool.user1Id !== userId && pool.user2Id !== userId) {
            return res.status(403).json({ message: 'Invalid user token for this pool' });
        }

        return res.status(200).json({ message: 'Successfully connected', poolId, userId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
