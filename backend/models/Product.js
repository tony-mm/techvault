const { readDB, writeDB } = require('../config/dbAdapter');

class ProductRepository {
    async findAll(filters = {}) {
        const { products } = readDB();
        let result = products;

        if (filters.category) {
            result = result.filter(p => p.category.toLowerCase().includes(filters.category.toLowerCase()));
        }

        if (filters.search) {
            const search = filters.search.toLowerCase();
            result = result.filter(p => 
                p.name.toLowerCase().includes(search) || 
                p.description.toLowerCase().includes(search) ||
                p.brand.toLowerCase().includes(search)
            );
        }

        return result;
    }

    async findById(id) {
        const { products } = readDB();
        return products.find(p => p.id === parseInt(id) || p._id === id);
    }

    async create(productData) {
        const data = readDB();
        const newProduct = {
            ...productData,
            _id: Date.now().toString(),
            id: data.products.length > 0 ? Math.max(...data.products.map(p => p.id || 0)) + 1 : 1,
            createdAt: new Date().toISOString()
        };
        data.products.push(newProduct);
        writeDB(data);
        return newProduct;
    }

    async update(id, productData) {
        const data = readDB();
        const index = data.products.findIndex(p => p.id === parseInt(id) || p._id === id);
        if (index !== -1) {
            data.products[index] = { ...data.products[index], ...productData, updatedAt: new Date().toISOString() };
            writeDB(data);
            return data.products[index];
        }
        return null;
    }

    async delete(id) {
        const data = readDB();
        const initialLength = data.products.length;
        data.products = data.products.filter(p => p.id !== parseInt(id) && p._id !== id);
        writeDB(data);
        return data.products.length < initialLength;
    }
}

module.exports = new ProductRepository();
