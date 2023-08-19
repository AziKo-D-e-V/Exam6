const {Router} = require("express");
const { register, login, changePassword, checkCode, getStudent, getExam, getExams, sendExam } = require("../controller/student.controller");
const isStudent = require("../middlewares/isStudent.middleware");

const router = new Router()

router.get('/student', getStudent)
router.get('/student/exams', getExams)
router.get('/student/exams/:id', getExam)

router.post("/student/login", login);
router.post("/student/register", register);
router.post("/student/register/verify", checkCode);
router.post("/student/settings/newpass", changePassword);
router.post('/student/exams/:exam_id', isStudent, sendExam)



module.exports = router;