const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/db.json');

const initializeDB = () => {
    const dataDir = path.join(__dirname, '../../data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir);
    }
    if (!fs.existsSync(DB_PATH)) {
        const initialData = {
            products: [],
            heroSlides: [],
            settings: { flashSaleEndTime: '' }
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    }
};

const readDB = () => {
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
};

const writeDB = (data) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};

module.exports = { initializeDB, readDB, writeDB };
