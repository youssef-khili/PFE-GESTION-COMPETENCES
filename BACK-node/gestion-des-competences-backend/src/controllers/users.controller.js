const {
    findAll,
    update,
    create,
    smartDelete,
    updatePwd,
    findByEmail,
    upload,
    findAllWithSkillEval,
    Delete
} = require('../services/users.service')
const db = require("../models");
const {generateRandomString} = require("../services/general.service");
const bcrypt = require("bcrypt");

exports.getUsers = (req, res) => {
    findAll(res);
}
exports.getUsersWithSkillEvaluation = (req, res) => {
    let departmentId;
    let userId ='';
    const user = req.data;
    const roles = ['ADMIN','DIRECTOR','USER'];
    if(roles.includes(user.Role.name)) {
        departmentId='';
    }else {
        departmentId= req.data.Department.id;
    }
    if(user.Role.name === 'USER'){
        userId = user.id;
    }
    findAllWithSkillEval(departmentId,userId, res);
}
exports.getUserByEmail = (req, res) => {
    findByEmail(req.params.email, res)
}
exports.addUser = async (req, res) => {
    try {
        const existingUser = await db.User.findOne({ where: { email: req.body.email } });

        if (existingUser) {
            return res.status(400).send({ message: 'This address email already exists' });
        }

        const randomPwd = generateRandomString();
        const newPwd = await bcrypt.hash(randomPwd, 10);

        const user = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            company: req.body.company,
            RoleId: req.body.RoleId,
            DepartmentId: req.body.DepartmentId,
            FunctionId: req.body.FunctionId,
            password: newPwd,
        };

        const skills = await db.Skill.findAll();
        console.log("Skills retrieved:", skills);

        await create(user, res, randomPwd, skills);
    } catch (error) {
        console.error("Unexpected error in addUser:", error);
        res.status(500).send({ message: 'Internal server error', error });
    }
};

exports.updateUser = (req, res) => {
    db.User.findByPk(req.body.id).then(async (user) => {
        if (user) {
            const userEdited = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                RoleId: req.body.RoleId,
                company: req.body.company,
                DepartmentId: req.body.DepartmentId,
                FunctionId: req.body.FunctionId,
                enabled: req.body.enabled
            }
            update(req.body.id, userEdited, res);
        } else {
            res.status(400).send({message: "This user doesn\'t exist"});
        }
    });
}
exports.updatePassword = async (req, res) => {
    const randomPwd = generateRandomService();
    const newPwd = await bcrypt.hash(randomPwd, 10);
    const result = await updatePwd(req.body.id, newPwd, randomPwd, res);
}
exports.disableUser = (req, res) => {
    db.User.findOne({where: {id: req.params.id}}).then((user) => {
        if (user) {
            const existingUser = user.dataValues;
            if (existingUser.enabled) {
                smartDelete(req.params.id, res)
            } else {
                res.status(400).send({message:'User is already deleted'});
            }
        } else {
            res.status(400).send({message:'User not found'});
        }
    });
}
exports.deleteUser = (req, res) => {
        db.User.findOne({where: {id: req.params.id}}).then((user) => {
            if (user) {
                Delete(req.params.id, res)
            } else {
                res.status(400).send({message: 'User not found'});
            }
        });

}
exports.addUsersViaFile = (req, res) => {
    const result = upload(req, res);
}
