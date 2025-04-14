var express = require('express');
var router = express.Router();
const {getSkills, addSkill, deleteSkill, updateSkill, getSkillsByIds, getSkillsNames, addSkillsViaFile} = require("../controllers/skill.controller");
const {authMiddleware} = require("../middlewares/auth.middleware");
const uploadFile = require("../middlewares/upload-file.middleware");

/* GET skills by ids. */
router.get('/get-by-ids/:skillsId',authMiddleware, getSkillsByIds);
/* GET skills names. */
router.get('/get-names',authMiddleware, getSkillsNames);
/* GET skills. */
router.get('/get',authMiddleware, getSkills);
/* Add skill */
router.post('/adds',authMiddleware, addSkill);
/* Delete skill */
router.delete('/:id',authMiddleware, deleteSkill);
/* Edit skill */
router.put('/updates',authMiddleware, updateSkill);
router.post('/upload-file',authMiddleware,uploadFile.single("file"),addSkillsViaFile);

module.exports = router;
