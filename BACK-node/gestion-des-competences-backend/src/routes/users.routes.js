var express = require('express');
var router = express.Router();
const {addUser, deleteUser, updateUser, getUsers, updatePassword, getUserByEmail, addUsersViaFile,
    getUsersWithSkillEvaluation, disableUser
} = require("../controllers/users.controller");
const uploadFile = require("../middlewares/upload-file.middleware");
const {authMiddleware} = require("../middlewares/auth.middleware");
const {findAllFullname} = require("../services/users.service");
const {adminVerifMiddleware} = require("../middlewares/adminVerif.middleware");

/* GET users. */
router.get('/',authMiddleware, getUsers);
router.get('/get-fullnames',authMiddleware, findAllFullname);
router.get('/skillEval',authMiddleware, getUsersWithSkillEvaluation);
/* GET user by email. */
router.get('/:email',authMiddleware, getUserByEmail);
/* Add new user. */
router.post('/',authMiddleware, addUser);
/* Delete user. */
router.delete('/delete/:id',authMiddleware,adminVerifMiddleware, deleteUser);
/* Disable user. */
router.delete('/disable/:id',authMiddleware,adminVerifMiddleware, disableUser);
/* Edit user credentials without password. */
router.put('/',authMiddleware, updateUser);
/* Edit user password. */
router.put('/update-password',authMiddleware, updatePassword);
/* Upload excel file to add users. */
router.post('/upload-file',authMiddleware,uploadFile.single("file"),addUsersViaFile)

module.exports = router;
