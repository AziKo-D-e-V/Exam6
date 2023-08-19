const Groups = require("../models/group.model");
const Members = require("../models/members.model");
const Student = require("../models/student.model");

const createGroup = async (req, res) => {
  try {
    const { name } = req.body;

    await Groups.create({ name }, { logging: false });

    res.status(201).json({ message: "Group created successfully" });
  } catch (error) {
    console.log(error.message);
  }
};
//all groups get
const getGroups = async (req, res) => {
  try {
    const groups = await Groups.findAll({ logging: false });
    res.status(200).json({ groups: groups });
  } catch (error) {
    console.log(error.message);
  }
};

//student group get
const getGroupStudents = async (req, res) => {
  try {
    const { groupId } = req.params;
    const students = await Members.findAll(
      {
        where: {
          group_id: groupId,
        },
      },
      { include: [Student, Groups] },
      { logging: false }
    );

    res.status(200).json({ students });
  } catch (error) {}
};

//add student for group
const addStudentGroup = async (req, res) => {
  const { group_id, student_id } = req.body;

  const group = await Groups.findByPk(group_id, { logging: false });
  const student = await Student.findByPk(student_id, { logging: false });

  const findStudent = await Members.findAll(
    { where: { student_id } },
    { logging: false }
  );
  if (!findStudent && student !== null && group !== null) {
    await Members.create(
      { group_id: group_id, student_id: student_id },
      { logging: false }
    );
    res.status(201).json({ message: "Student add this group" });
  } else {
    res.status(403).json({ message: "Group or Student not found" });
  }
};

module.exports = { createGroup, getGroups, getGroupStudents, addStudentGroup };
