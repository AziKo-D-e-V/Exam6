const { Model, DataTypes } = require("sequelize");

const sequelize = require("../database/sequelize");

class Student extends Model {}

Student.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
},
  last_name: {
    type: DataTypes.STRING,
    allowNull: false,
},
  email: {
    type: DataTypes.STRING,
    allowNull: false,
},
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
},{
    sequelize,
    tableName: "students",
    createdAt: "created_at",
    updatedAt: "updated_at",
    freezeTableName: false, 
});

module.exports = Student;