const { Model, DataTypes } = require("sequelize");

const sequelize = require("../database/sequelize");

class Tasks extends Model {}

Tasks.init(
  {
    data: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaults: false,
    },
    student_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: "tasks",
    createdAt: "created_at",
    updatedAt: "updated_at",
    freezeTableName: false,
  }
);

module.exports = Tasks;
