const {findAll,create,update,upload,smartDelete} = require("../services/department.service");
const db = require("../models");
exports.getDepartments=(req,res)=>{
    findAll(res);
}
exports.addDepartment=(req,res)=>{
    db.Department.findOne({where : {name : req.body.name}}).then(async result => {
        if (!result) {
            // add fct if a fct with same name doesn't exist or it's deleted
            let department = {
                name: req.body.name,
                description: req.body.description,
            };
            create(department, res);
        } else {
            res.status(400).send({message:'This description already exists'})
        }
    })
}
exports.updateDepartment=(req,res)=>{
    db.Department.findOne({where: {id: req.body.id}}).then( (result) => {
        if (result) {
            let departmentEdited = {
                name: req.body.name,
                description: req.body.description,
            }
            update(req.body.id, departmentEdited, res);
        } else {
            res.status(400).send({message:"This department doesn\'t exist"});
        }
    });
}
exports.deleteDepartment=(req,res)=>{
    db.Department.findOne({where : {id : req.params.id}}).then( (result) => {
        if (result) {
            const existingDepartment= result.dataValues;
            if (existingDepartment.enabled){
                smartDelete(req.params.id,res)
            } else{
                res.status(400).send({message:'Department is already deleted'});
            }
        }else {
            res.status(400).send({message:'Department not found'});
        }});
}
exports.addDepartmentsViaFile=async (req, res) => {
    const result = await upload(req, res);
}
