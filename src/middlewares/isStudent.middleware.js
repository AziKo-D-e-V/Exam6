const jwt = require("../libs/jwt");
const Student = require("../models/student.model");

const isStudent = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }
    const user = jwt.verify(token);
    const student = await Student.findByPk(user.studentId, { logging: false });

    if (student == null) {
      res.status(403).json({ message: "Not access" });
    } else {
      req.student = student;
      next();
    }
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = isStudent;