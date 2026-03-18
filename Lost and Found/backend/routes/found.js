const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// POST /api/found - Report a found item
router.post('/', async (req, res) => {
    try {
        const { item_name, description, location, date, contact } = req.body;

        if (!item_name || !description || !location || !date || !contact) {
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        const item = new Item({
            item_name,
            description,
            location,
            type: 'found',
            date,
            contact,
        });

        const saved = await item.save();
        res.status(201).json({ success: true, message: 'Found item reported successfully!', data: saved });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;
