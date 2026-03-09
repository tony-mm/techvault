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
            settings: { flashSaleEndTime: '' },
            users: [],
            orders: []
        };
        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
    } else {
        // Ensure missing collections are added to existing DB
        const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
        let modified = false;
        if (!data.users) { data.users = []; modified = true; }
        if (!data.products) { data.products = []; modified = true; }
        if (!data.heroSlides) { data.heroSlides = []; modified = true; }
        if (!data.settings) { data.settings = { flashSaleEndTime: '' }; modified = true; }
        if (!data.orders) { data.orders = []; modified = true; }
        
        if (modified) {
            fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
        }
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
