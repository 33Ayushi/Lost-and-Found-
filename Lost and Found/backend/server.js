require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/lost', require('./routes/lost'));
app.use('/api/found', require('./routes/found'));
app.use('/api/items', require('./routes/items'));

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Lost & Found API is running 🚀' });
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

async function startServer() {
    let uri = MONGODB_URI;

    // If no external MongoDB URI is set, spin up an in-memory server
    if (!uri || uri.includes('localhost')) {
        try {
            await mongoose.connect(uri || 'mongodb://localhost:27017/lostandfound');
            console.log('✅ Connected to local MongoDB');
        } catch {
            console.log('⚠️  Local MongoDB not found. Starting in-memory MongoDB...');
            const { MongoMemoryServer } = require('mongodb-memory-server');
            const mongod = await MongoMemoryServer.create();
            uri = mongod.getUri();
            console.log('✅ In-memory MongoDB started at:', uri);
            await mongoose.connect(uri);
            console.log('✅ Connected to in-memory MongoDB (data resets on restart)');
        }
    } else {
        await mongoose.connect(uri);
        console.log('✅ Connected to MongoDB Atlas');
    }

    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📋 API Endpoints:`);
        console.log(`   POST http://localhost:${PORT}/api/lost`);
        console.log(`   POST http://localhost:${PORT}/api/found`);
        console.log(`   GET  http://localhost:${PORT}/api/items`);
    });
}

startServer().catch((err) => {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
});
