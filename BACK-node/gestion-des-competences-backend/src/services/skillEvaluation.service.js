const db = require('../models');
const {Op} = require("sequelize");
const sequelize = require("sequelize");

exports.create = (skillEvaluation, res) => {
    db.SkillEvaluation.create(skillEvaluation).then(result => {
        if (result) {
            res.status(200).send({message: 'Evaluation added successfully'})
        }
    })
}
exports.update = (skillEvaluation, id, res) => {
    db.SkillEvaluation.update(skillEvaluation, {where: {id: id}}).then(result => {
        if (result) {
            res.status(200).send({message: 'Evaluation updated successfully'})
        }
    })
}
// return all skill evaluation for user and an array of the skills of his function
exports.getSkillEvaluationsByUser = (userId, res) => {
    db.SkillEvaluation.findAll({
        where: {forUser: userId},
        include: [{model: db.User, as: 'evaluator'}, {model: db.Skill, include: [db.Category]}],
    }).then(result => {
        if (result) {
            res.status(200).send(result);
        }
    })
}
exports.updateStatus = (ids, status, evaluatorId, res) => {
    db.SkillEvaluation.update(
        {
            status: status,
            evaluatorId: evaluatorId
        }, {
            where: {id: ids}
        }).then(result => {
        if (result) {
            res.status(200).send({
                message: 'Status updated'
            })
        }
    })
}
exports.getSkillEvaluationsMatrix = (departmentOptions, res) => {
    db.User.findAll(
        {
            attributes: ['firstName', 'lastName', 'id'],
            include: [
                {
                    model: db.SkillEvaluation,
                    as: 'OwnSkillEvaluation',
                    attributes: ['level', 'id'],
                    where: {
                        status: 'Valid'
                    },
                    include: [
                        {model: db.Skill, attributes: ['name', 'id'],},
                    ]
                },{model: db.Department, attributes: [ 'id'],where:departmentOptions}
            ]
        })
        .then(result => {
            if (result) {
                const transformedData = transformDashboardData(result);
                res.send(transformedData);
            }
        })
}
exports.getSkillEvaluationWithFilter = (departments, users, skills, minLevel, res) => {
    const skillEvalOptions = {status: 'Valid'};
    const userOption = {enabled: true};
    const skillOption = {};
    if (minLevel) {
        skillEvalOptions.level = {[Op.gte]: minLevel};
    }
    if (skills) {
        skillOption.id = skills;
    }
    if (users) {
        userOption.id = users;
    }
    if (departments) {
        userOption.DepartmentId = departments;
    }
    db.User.findAll(
        {
            attributes: ['firstName', 'lastName', 'id'],
            where: userOption,
            include: [
                {
                    model: db.SkillEvaluation,
                    as: 'OwnSkillEvaluation',
                    attributes: ['level', 'id'],
                    where: skillEvalOptions,
                    include: [
                        {model: db.Skill, attributes: ['name', 'id'], where: skillOption}
                    ]
                }

            ]
        })
        .then(result => {
            if (result) {
                const transformedData = transformDashboardData(result);
                res.send(transformedData);
            }
        })

}
exports.getMeanEvaluationLevel= (req,res)=>{
    const user = req.data;
    const skillEvalOption = {status : 'Valid'};
    const userOption = {};
    const skillOption = {};
    if (req.query.skills) {
        skillOption.id = req.query.skills.split(',');
    }
    if (req.query.userId) {
        skillEvalOption.forUser = req.query.userId;
    }
    if (req.query.department) {
        userOption.DepartmentId = req.query.department;
    }
    if (user.Role.name === 'MANAGER'){
        userOption.DepartmentId = user.Department.id;
    }
    db.SkillEvaluation.findAll({
        where:skillEvalOption,
        attributes: [[sequelize.fn('avg', sequelize.col('level')), 'avgLevel']],
        group: 'skillId',
        include: [
            {model : db.Skill,attributes:['name','id'],where: skillOption},
            {model: db.User, where:userOption ,attributes:['id']}]
        }).then(result =>{
            if(result){
                res.status(200).send(result);
            }
    })
}
function transformDashboardData(data) {
    const resultData = [];
    data.forEach(function (column) {
        const jsonData = {};
        jsonData['user'] = column.firstName + ' ' + column.lastName;
        jsonData['userId'] = column.id;
        column.OwnSkillEvaluation.forEach(evaluation => {
            jsonData['evaluationId'] = evaluation.id;
            const columnName = evaluation.Skill.name;
            jsonData[columnName] = evaluation.level;
        })
        resultData.push(jsonData);
    });
    return resultData;
}
