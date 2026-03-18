const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET /api/items - Get all items with optional search
router.get('/', async (req, res) => {
    try {
        const { search, type } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { item_name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
            ];
        }

        if (type && (type === 'lost' || type === 'found')) {
            query.type = type;
        }

        const items = await Item.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: items.length, data: items });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// DELETE /api/items/:id - Delete an item
router.delete('/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ success: false, message: 'Item not found' });
        }
        res.status(200).json({ success: true, message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

module.exports = router;
