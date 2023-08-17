const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "postgres://postgres:Azizjon.0107@localhost:5432/management"
);

module.exports = sequelize;
