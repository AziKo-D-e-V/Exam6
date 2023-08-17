const {Router} = require("express");
const { register, login, changePassword, checkCode } = require("../controller/student.controller");

const router = new Router()

router.post("/student/login", login);
router.post("/student/register", register);
router.post("/student/register/verify", checkCode);
router.post("/student/settings/newpass", changePassword);



module.exports = router;