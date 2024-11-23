// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: './map_banning.db',
// });

// module.exports = sequelize;

require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    'userdetails', // Database name
    'postgres', // Username
    '', // Password
    {
        host: '', // Hostname
        dialect: 'postgres', // Database dialect (e.g., 'postgres', 'mysql')
        port: 5432,
        dialectOptions: {
            ssl: {
                require: true, // Force SSL usage
                rejectUnauthorized: false, // Allow self-signed certificates (Amazon RDS uses its own certificates)
            },
        },
        logging: false, // Disable SQL query logging (set true for debugging)
    }
);

module.exports = sequelize;
