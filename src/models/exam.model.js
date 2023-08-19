const { Model, DataTypes } = require("sequelize");

const sequelize = require("../database/sequelize");

class Exams extends Model {}

Exams.init(
  {
    task: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    group_id: {
      type: DataTypes.INTEGER
    },  
    duration: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "exams",
    createdAt: "created_at",
    updatedAt: "updated_at",
    freezeTableName: false,
  }
);

module.exports = Exams;
