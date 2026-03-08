const Settings = require('../models/Settings');

// @desc    Get global settings
exports.getSettings = async (req, res) => {
    try {
        const settings = await Settings.get();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update global settings
exports.updateSettings = async (req, res) => {
    try {
        const settings = await Settings.update(req.body);
        res.json(settings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
