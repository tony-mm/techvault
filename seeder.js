const fs = require('fs');
const path = require('path');
const Product = require('./backend/models/Product');
const { initializeDB, readDB, writeDB } = require('./backend/config/dbAdapter');

dotenv.config();
initializeDB();

const seedData = async () => {
    try {
        console.log('Clearing existing products...');
        const data = readDB();
        data.products = [];
        writeDB(data);

        // Read products.json
        const dataPath = path.join(__dirname, 'products.json');
        const fileContent = fs.readFileSync(dataPath, 'utf-8');
        const { products } = JSON.parse(fileContent);

        // Seed products one by one using repository to ensure proper ID generation/_id
        for (const p of products) {
            await Product.create({
                ...p,
                imageType: 'upload',
                variations: p.variations || { storage: [], colors: [] }
            });
        }

        console.log(`Products seeded successfully!`);
        process.exit();
    } catch (error) {
        console.error(`Error with seeding: ${error.message}`);
        process.exit(1);
    }
};

seedData();
