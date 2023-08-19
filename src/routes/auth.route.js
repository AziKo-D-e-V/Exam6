const { Router } = require("express");
const {
  register,
  login,
  changePassword,
  createExam,
  getExams,
  getExam,
  getTasks,
  getTask,
  checkUp,
  getCheckUps,
} = require("../controller/auth.controller");
const { isAdmin } = require("../middlewares/isAdmin.middleware");

const router = new Router();

router.get("/teacher/exam", isAdmin, getExams);
router.get("/teacher/exam/answer", isAdmin, getTasks);
router.get("/teacher/exam/checkup/:id", isAdmin, getCheckUps);
router.get("/teacher/exam/answer/:id", isAdmin, getTask);
router.get("/teacher/exam/:id", isAdmin, getExam);

router.post("/teacher/login", login);
router.post("/teacher/register", register);
router.post("/teacher/settings/newpass", changePassword);

router.post("/teacher/exam/:id", isAdmin, createExam);
router.post("/teacher/exam/check/:id", isAdmin, checkUp);

module.exports = router;
