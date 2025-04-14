const {findAll,create,update,upload,smartDelete, findAllIncludeDepart} = require("../services/function.services");
const db = require("../models");
exports.getFunctions=(req,res)=>{
    findAll(res);
}
exports.getFunctionsIncludeDepart=(req,res)=>{
    findAllIncludeDepart(res);
}
exports.addFunction=(req,res)=>{
    db.Function.findOne({where : {name : req.body.name}}).then(async fct => {
        if (!fct) {
            // add fct if a fct with same name doesn't exist or it's deleted
            let fct = {
                name: req.body.name,
                DepartmentId: req.body.DepartmentId,
            };
            create(fct, res);
        } else {
            res.status(400).send({message:'This function already exists'})
        }
    })
}
exports.updateFunction=(req,res)=>{
    db.Function.findOne({where: {id: req.body.id}}).then( (fct) => {
        if (fct) {
            let fctEdited = {
                name: req.body.name,
                DepartmentId: req.body.DepartmentId,
            }
            update(req.body.id, fctEdited, res);
        } else {
            res.status(400).send({message:"This function doesn\'t exist"});
        }
    });
}
exports.deleteFunction=(req,res)=>{
    db.Function.findOne({where : {id : req.params.id}}).then( (fct) => {
        if (fct) {
            const existingFct= fct.dataValues;
            if (existingFct.enabled){
                smartDelete(req.params.id,res)
            } else{
                res.status(400).send({message:'Function is already deleted'});
            }
        }else {
            res.status(400).send({message:'Function not found'});
        }});
}
exports.addFctsViaFile=async (req, res) => {
    const result = await upload(req, res);
}
