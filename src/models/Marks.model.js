const { Model, DataTypes } = require("sequelize");

const sequelize = require("../database/sequelize");

class Marks extends Model {}

Marks.init(
  {
    mark: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    exam_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: "marks",
    createdAt: "created_at",
    updatedAt: "updated_at",
    freezeTableName: false,
  }
);

module.exports = Marks;
