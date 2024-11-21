const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pool = sequelize.define('Pool', {
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
});

module.exports = Pool;
