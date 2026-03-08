const HeroSlide = require('../models/HeroSlide');

// @desc    Get all hero slides
exports.getHeroSlides = async (req, res) => {
    try {
        const slides = await HeroSlide.findAll();
        res.json(slides);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a hero slide
exports.createHeroSlide = async (req, res) => {
    try {
        const slide = await HeroSlide.create(req.body);
        res.status(201).json(slide);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete a hero slide
exports.deleteHeroSlide = async (req, res) => {
    try {
        const success = await HeroSlide.delete(req.params.id);
        if (success) {
            res.json({ message: 'Slide removed' });
        } else {
            res.status(404).json({ message: 'Slide not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
