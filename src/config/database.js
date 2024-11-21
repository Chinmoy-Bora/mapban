const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '/app/map_banning.db',
});

module.exports = sequelize;
