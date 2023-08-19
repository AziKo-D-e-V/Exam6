const {Router} = require("express");

const { isAdmin } = require("../middlewares/isAdmin.middleware");
const { createGroup, getGroups, getGroupStudents, addStudentGroup } = require("../controller/group.controller");

const router = new Router()

router.get('/groups', isAdmin, getGroups)
router.get('/group/:groupId', isAdmin, getGroupStudents)

router.post('/group', isAdmin, createGroup);
router.post('/group/add', isAdmin, addStudentGroup);



module.exports = router;


