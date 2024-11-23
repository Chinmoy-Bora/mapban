require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME, // Database name
    process.env.DB_USER, // Username
    process.env.DB_PASSWORD, // Password
    {
        host: process.env.DB_HOST, // Hostname
        port: process.env.DB_PORT, // Port
        dialect: 'postgres', // Database dialect
        dialectOptions: {
            ssl: {
                require: process.env.DB_SSL_REQUIRE === 'true', // Force SSL usage
                rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED === 'true', // Allow self-signed certificates
            },
        },
        logging: false, // Disable SQL query logging (set true for debugging)
    }
);

module.exports = sequelize;
