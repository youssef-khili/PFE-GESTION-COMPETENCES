var express = require('express');
var router = express.Router();
const {getFunctions,addFctsViaFile,addFunction,deleteFunction,updateFunction, getFunctionsIncludeDepart} = require("../controllers/function.controller");
const uploadFile = require("../middlewares/upload-file.middleware");
const {authMiddleware} = require("../middlewares/auth.middleware");
/* GET functions. */
router.get('/get',authMiddleware, getFunctions);
/* GET functions include department objects. */
router.get('/getIncludeDep',authMiddleware, getFunctionsIncludeDepart);
/* Add function */
router.post('/add',authMiddleware, addFunction);
/* Delete function */
router.delete('/delete/:id',authMiddleware, deleteFunction);
/* Edit function */
router.put('/update',authMiddleware, updateFunction);
/* Upload excel file to add functions */
router.post('/upload-file',authMiddleware,uploadFile.single("file"),addFctsViaFile);
module.exports = router;
