const bcrypt = require('bcryptjs');
const { readDB, writeDB } = require('../config/dbAdapter');

class User {
    static async findById(id) {
        const data = readDB();
        return data.users.find(u => u.id === id || u._id === id);
    }

    static async findOne({ email }) {
        const data = readDB();
        const user = data.users.find(u => u.email === email);
        if (!user) return null;

        // Return an object with a matchPassword method
        return {
            ...user,
            matchPassword: async function(enteredPassword) {
                return await bcrypt.compare(enteredPassword, this.password);
            }
        };
    }

    static async create(userData) {
        const data = readDB();
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);

        const newUser = {
            _id: Date.now().toString(),
            id: data.users.length + 1,
            email: userData.email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };

        data.users.push(newUser);
        writeDB(data);
        return newUser;
    }
}

module.exports = User;
