const {findAll,update,create,smartDelete, upload}=require('../services/category.service')
const db = require("../models");

exports.getCategories=(req,res)=>{
    findAll(res);
}
exports.addCategory=(req,res)=>{
    console.log('body categories ' , req.body)
    db.Category.findOne({where : {name : req.body.name}}).then(async category => {
        if (!category || !category.dataValues.enabled) {
            // add category if a category with same name doesn't exist or it's deleted
            let category = {
                name: req.body.name,
                //function: req.body.function,
            };
            create(category, res);
        } else {
            res.status(400).send({message:'This category already exists'})
        }
    })

}
exports.updateCategory=(req,res)=>{
    db.Category.findOne({where: {id: req.body.id}}).then((category) => {
        if (category) {
            let categoryEdited = {
                name: req.body.name,
                //function: req.body.function,

            }
            update(req.body.id, categoryEdited, res);
        } else {
            res.status(400).send({message:"This category doesn\'t exist"});
        }
    });
}
exports.deleteCategory=(req,res)=>{
    db.Category.findOne({where : {id : req.params.id}}).then( (category) => {
        if (category) {
            const existingCategory = category.dataValues;
            if (existingCategory.enabled){
                smartDelete(req.params.id,res)
            } else{
                res.status(400).send({message:'Category is already deleted'});
            }
        }else {
            res.status(400).send({message:'Category not found'});
        }});
}
exports.addCategoriesViaFile=async (req, res) => {
    const result = await upload(req, res);
}
