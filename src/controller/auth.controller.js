const bcrypt = require("bcrypt");
const jwt = require("../libs/jwt");
const { generateHash, compareHash } = require("../libs/bcrypt");
const { jwtSecretKey } = require("../../config");
const Users = require("../models/auth.model");
const Exams = require("../models/exam.model");
const Groups = require("../models/group.model");
const Tasks = require("../models/task.model");
const Student = require("../models/student.model");
const Members = require("../models/members.model");
const Marks = require("../models/Marks.model");

const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const generate = await generateHash(password);
    const findUser = await Users.findAll({
      where: { username },
      logging: false,
    });

    if (findUser.length > 0) {
      return res.status(404).json({ message: "Username already exists" });
    }

    const admin = await Users.create(
      { username, password: generate },
      { logging: false }
    );
    const token = jwt.sign({ userId: admin.id });
    res.cookie("token", token);

    res.status(201).json({ message: "User created", token });
  } catch (error) {
    console.log(error.message);
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const findUser = await Users.findAll({
      where: { username },
      logging: false,
    });

    if (findUser.length < 1) {
      return res
        .status(404)
        .json({ message: "Invalid email or password provided for login" });
    }
    const compare = await compareHash(password, findUser[0].password);

    if (!compare) {
      return res
        .status(404)
        .json({ message: "Invalid password provided to login" });
    }
    console.log(findUser[0].id);
    const token = jwt.sign({ userId: findUser[0].id });

    res.cookie("token", token);

    res.status(201).json({ message: "Login successful", token: token });
  } catch (error) {
    console.log(error);
  }
};

const changePassword = async (req, res) => {
  try {
    const { password, newpass, renewpass } = req.body;
    const { token } = req.cookies;
    const decodedToken = jwt.verify(token, jwtSecretKey);
    const userId = decodedToken.userId;

    const user = await Users.findByPk(userId, { logging: false });
    const compare = await compareHash(password, user.password);

    if (!compare) {
      return res.status(404).json({ message: "Invalid password" });
    } else if (newpass === renewpass) {
      const generate = await generateHash(newpass);
      user.password = generate;
      await user.save({ logging: false });
      res.status(201).json({ message: "Successfully changed password" });
    } else {
      res.status(403).json({
        message:
          "Error something email or new Password or return new Password ",
      });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const createExam = async (req, res) => {
  const { id } = req.params;
  const { task, duration } = req.body;

  const endexam = new Date(new Date().getTime() + duration * 60 * 60 * 1000);
  const findExam = await Exams.findAll(
    { where: { group_id: id } },
    { logging: false }
  );
  if (findExam !== null) {
    const exam = await Exams.create(
      { task, duration: endexam, group_id: id, start_date: new Date() },
      { logging: false }
    );
    res.status(201).json({ message: "Exam successfully created", data: exam });
  } else {
    res.status(403).json({ message: "Allready exam created this group" });
  }
};
//all exams get
const getExams = async (req, res) => {
  try {
    const exams = await Exams.findAll();
    res.status(201).json({ message: exams });
  } catch (error) {
    console.log(error.message);
  }
};

//get exam
const getExam = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await Exams.findByPk(id, {
      include: [Groups],
      logging: false,
    });
    res.status(201).json({ message: exam });
  } catch (error) {
    console.log(error.message);
  }
};

// exam javoblarini ushlaydi task.modeldagilarni
const getTasks = async (req, res) => {
  try {
    const tasks = await Tasks.findAll({
      where: { isActive: true },
      include: [Groups],
    });
    res.status(200).json({ message: tasks });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ message: error.message });
  }
};

// examni 1tasini ushlaydi task.modeldagilarni
const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await Tasks.findByPk(id, {
      where: { isActive: true },
      include: [Groups],
    });
    if (tasks) {
      res.status(200).json({ messages: "Success", tasks });
    } else {
      res.status(404).json({ messages: "Not Found" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

// examni baholash
const checkUp = async (req, res) => {
  const { id } = req.params; // student id keladi
  const { exam_id, mark } = req.body;
  const findStudent = await Student.findByPk(id, { logging: false });
  if (findStudent !== null) {
    const results = await Marks.create({
      exam_id,
      mark,
      student_id: findStudent.id,
    });
    res.status(201).json({ message: "Success", results });
  } else {
    res.status(404).json({ message: "Student not found" });
  }
};

//baholanganlarni ko'rish

const getCheckUps = async (req, res) => {
  try {
    const { id } = req.params; //Marksni id si
    const data = await Marks.findByPk(id, { include: [Student], logging: false });

    res.status(200).json({ message: "Success", data });
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  login,
  checkUp,
  register,
  getExams,
  getExam,
  getTasks,
  getTask,
  createExam,
  getCheckUps,
  changePassword,
};
