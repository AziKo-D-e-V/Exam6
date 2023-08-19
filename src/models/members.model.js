const { Model, DataTypes } = require("sequelize");

const sequelize = require("../database/sequelize");

class Members extends Model {}

Members.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    group_id: {
      type: DataTypes.STRING,
    },
    student_id: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    tableName: "members",
    createdAt: "created_at",
    updatedAt: "updated_at",
    freezeTableName: false,
  }
);

module.exports = Members;
