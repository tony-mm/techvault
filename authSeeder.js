const dotenv = require('dotenv');
const User = require('./backend/models/User');
const { initializeDB } = require('./backend/config/dbAdapter');

dotenv.config();
initializeDB();

const seedAdmin = async () => {
    try {
        console.log('Checking for existing admin...');
        const adminExists = await User.findOne({ email: 'admin@techvault.com' });

        if (adminExists) {
            console.log('Admin user already exists.');
        } else {
            console.log('Creating initial admin user...');
            await User.create({
                email: 'admin@techvault.com',
                password: 'adminpassword123'
            });
            console.log('Admin user seeded successfully!');
            console.log('Email: admin@techvault.com');
            console.log('Password: adminpassword123');
        }
        process.exit();
    } catch (error) {
        console.error(`Error with seeding admin: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
