const { readDB, writeDB } = require('../config/dbAdapter');

class SettingsRepository {
    async get() {
        const { settings } = readDB();
        return settings;
    }

    async update(settingsData) {
        const data = readDB();
        data.settings = { ...data.settings, ...settingsData, updatedAt: new Date().toISOString() };
        writeDB(data);
        return data.settings;
    }
}

module.exports = new SettingsRepository();
