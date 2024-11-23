// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Pool = sequelize.define('Pool', {
//     poolId: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         unique: true,
//     },
//     user1Id: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     user2Id: {
//         type: DataTypes.STRING,
//         allowNull: true, // Initially null
//     },
// });

// module.exports = Pool;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Import the database instance

// Define the Pool model
const Pool = sequelize.define(
    'Pool',
    {
        poolId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        user1Id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user2Id: {
            type: DataTypes.STRING,
            allowNull: true, // Initially null
        },
    },
    {
        tableName: 'pools', // Explicit table name (optional, Sequelize auto-pluralizes by default)
        timestamps: true, // Adds createdAt and updatedAt fields
    }
);

module.exports = Pool; // Export the Pool model

