const mongoose = require('mongoose');

function connectToDb() {
    const uri = process.env.DB_CONNECT; // MongoDB URI from Render environment variables
    if (!uri) {
        console.error("Error: DB_CONNECT environment variable not set!");
        process.exit(1); // stop server if no DB URI
    }

    mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log('Connected to DB'))
    .catch(err => {
        console.error('DB connection error:', err);
        process.exit(1); // stop server if DB connection fails
    });
}

module.exports = connectToDb;
