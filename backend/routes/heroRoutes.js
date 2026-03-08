const express = require('express');
const router = express.Router();
const {
    getHeroSlides,
    createHeroSlide,
    deleteHeroSlide
} = require('../controllers/heroController');

router.route('/')
    .get(getHeroSlides)
    .post(createHeroSlide);

router.route('/:id')
    .delete(deleteHeroSlide);

module.exports = router;
