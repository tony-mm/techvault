const { readDB, writeDB } = require('../config/dbAdapter');

class HeroRepository {
    async findAll() {
        const { heroSlides } = readDB();
        return heroSlides;
    }

    async create(slideData) {
        const data = readDB();
        const newSlide = {
            ...slideData,
            _id: Date.now().toString(),
            createdAt: new Date().toISOString()
        };
        data.heroSlides.push(newSlide);
        writeDB(data);
        return newSlide;
    }

    async delete(id) {
        const data = readDB();
        const initialLength = data.heroSlides.length;
        data.heroSlides = data.heroSlides.filter(s => s._id !== id);
        writeDB(data);
        return data.heroSlides.length < initialLength;
    }
}

module.exports = new HeroRepository();
