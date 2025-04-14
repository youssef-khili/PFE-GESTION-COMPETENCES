var express = require('express');
var router = express.Router();
const uploadFile = require("../middlewares/upload-file.middleware");
const {getDepartments, addDepartment, deleteDepartment, updateDepartment, addDepartmentsViaFile} = require("../controllers/department.controller");
const {authMiddleware} = require("../middlewares/auth.middleware");
/* GET department. */
router.get('/get',authMiddleware, getDepartments);
/* Add department */
router.post('/add',authMiddleware, addDepartment);
/* Delete department */
router.delete('/delete/:id',authMiddleware, deleteDepartment);
/* Edit department */
router.put('/update',authMiddleware, updateDepartment);
/* Upload excel file to add departments */
router.post('/upload-file',authMiddleware,uploadFile.single("file"),addDepartmentsViaFile);
module.exports = router;
