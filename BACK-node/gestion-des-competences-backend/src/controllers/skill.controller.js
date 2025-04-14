const {findAll,update,create,smartDelete, upload, findByIds, selectSkillsNames}=require('../services/skill.service')
const db = require("../models");

exports.getSkills=(req,res)=>{
    findAll(res);
}
exports.getSkillsByIds = (req,res)=>{
    findByIds(req,res);
}
exports.getSkillsNames=(req,res)=>{
    selectSkillsNames(req,res);
}
exports.addSkill=(req,res)=>{
    db.Skill.findOne({where : {name : req.body.name}}).then(async skill => {
        if (!skill || !skill.dataValues.enabled) {
            // add skill if a skill with same name doesn't exist or it's deleted
            let skill = {
                name: req.body.name,
                categoryId: req.body.CategoryId,
            };
            create(skill, res);
        } else {
            res.status(400).send({message:'This skill already exists'})
        }
    })

}
exports.updateSkill=(req,res)=>{
    db.Skill.findOne({where: {id: req.body.id}}).then((skill) => {
        if (skill) {
            let skillEdited = {
                name: req.body.name,
                CategoryId: req.body.CategoryId,
                //function: req.body.function,

            }
            update(req.body.id, skillEdited, res);
        } else {
            res.status(400).send({message:"This skill doesn\'t exist"});
        }
    });
}
exports.deleteSkill=(req,res)=>{
    console.log(req.params.id)
    db.Skill.findOne({where : {id : req.params.id}}).then( (skill) => {
        if (skill) {
            const existingSkill = skill.dataValues;
            if (existingSkill.enabled){
                smartDelete(req.params.id,res)
            } else{
                res.status(400).send({message:'Skill is already deleted'});
            }
        }else {
            res.status(400).send({message:'Skill not found'});
        }});
}
exports.addSkillsViaFile=async (req, res) => {
    const result = await upload(req, res);
}
