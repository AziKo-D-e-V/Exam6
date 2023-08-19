const Marks = require("./Marks.model");
const Exams = require("./exam.model");
const Groups = require("./group.model");
const Members = require("./members.model");
const Student = require("./student.model");
const Tasks = require("./task.model");

const Relation = async () => {

  Groups.hasMany(Exams, { foreignKey: "group_id" });
  Exams.belongsTo(Groups, { foreignKey: "group_id"});
  
  Groups.hasMany(Tasks, { foreignKey: "group_id" });
  Tasks.belongsTo(Groups, { foreignKey: "group_id"});
  
  Student.hasMany(Marks, { foreignKey: "student_id" });
  Marks.belongsTo(Student, { foreignKey: "student_id"});
  
  Groups.hasMany(Student, { foreignKey: "student_id" });
  Student.belongsTo(Groups, { foreignKey: "student_id"});
  


  Student.belongsToMany(Groups, { through: Members });
  Groups.belongsToMany(Student, { through: Members });
};

module.exports = Relation;
