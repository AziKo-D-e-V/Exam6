const { Model, DataTypes } = require("sequelize");

const sequelize = require("../database/sequelize");

class Groups extends Model {}

Groups.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
},
student_id:{
    type: DataTypes.INTEGER,
}
},{
    sequelize,
    tableName: "groups",
    createdAt: "created_at",
    updatedAt: "updated_at",
    freezeTableName: false, 
});

module.exports = Groups;