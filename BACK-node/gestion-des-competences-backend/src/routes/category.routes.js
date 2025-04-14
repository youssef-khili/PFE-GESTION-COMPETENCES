var express = require('express');
var router = express.Router();
const {getCategories, addCategory, updateCategory,deleteCategory, addCategoriesViaFile} = require("../controllers/category.controller");
const {authMiddleware} = require("../middlewares/auth.middleware");
const uploadFile = require("../middlewares/upload-file.middleware");
/* GET categories. */
router.get('/getCat',authMiddleware,getCategories );
/* Add category */
router.post('/addCat',authMiddleware, addCategory);
/* Delete category */
router.delete('/:id',authMiddleware, deleteCategory);
/* Edit category */
router.put('/updateCat',authMiddleware, updateCategory);
router.post('/upload-file',authMiddleware,uploadFile.single("file"),addCategoriesViaFile);

module.exports = router;
