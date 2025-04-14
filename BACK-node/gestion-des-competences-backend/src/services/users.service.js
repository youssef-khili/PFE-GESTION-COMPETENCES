const db = require('../models');
const {generateRandomString} = require('./general.service');
const bcrypt = require("bcrypt");
const {sendMail} = require("./mail.service");
const readXlsxFile = require("read-excel-file/node");

exports.findAll = (res) => {
    db.User.findAll({
        order: [
            ['createdAt', 'DESC'],
        ],
        attributes: ['id', 'email', 'firstName', 'lastName', 'company', 'enabled'],
        include: [db.Department, db.Function, db.Role],
    }).then(data => {
        res.status(200).send(data);
    })
}
exports.findAllFullname =(req,res)=>{
    let userOption={
        enabled : true
    };
    if(req.data.Role.name === 'MANAGER'){
        userOption.DepartmentId= req.data.Department.id;
    }
    db.User.findAll({
        where:userOption,
        order: [
            ['createdAt', 'DESC'],
        ],
        attributes: ['id', 'firstName', 'lastName'],
    }).then(data => {
        const users=data.map(user => {
            return {
                id: user.id,
                fullname: user.firstName+' '+user.lastName
            }
        })
        res.status(200).send(users);
    })
}
exports.findAllWithSkillEval = (departmentId,userId, res) => {
    let departmentOptions ={};
    let userOptions= {
        enabled: true
    };
    if(departmentId !== ''){
        departmentOptions.id = departmentId;
    }
    if (userId){
        userOptions.id = userId;
    }
    db.User.findAll({
        where:userOptions,
        order: [
            ['createdAt', 'DESC'],
        ],
        attributes: ['id', 'email', 'firstName', 'lastName'],
        include: [
            {model : db.Department, where: departmentOptions},
            db.Function,db.Role,
            ],
    }).then(data => {
        res.status(200).send(data);
    })
}
exports.findByEmail = (email, res) => {
    db.User.findOne({
        where: {
            enabled: true,
            email: email
        },
        attributes: ['id', 'email', 'firstName', 'lastName', 'company'],
        include: [db.Department, db.Function, db.Role]
    }).then(data => {
        if (data) {
            res.status(200).send(data);
        } else {
            res.status(400).send({message: 'User not found'});
        }
    })
}
exports.create = async (user, res, pwd, skills) => {

    db.User.create(user).then(async newUser => {
            const skillsEval = skills.map(elet => {
                return {
                    skillId: elet.dataValues.id,
                    forUser: newUser.id
                }
            })
            const evaluations = await db.SkillEvaluation.bulkCreate(skillsEval);
            const subject = 'New Account';

            const context = {
                userFirstName: user.firstName,
                userEmail: user.email,
                password: pwd
            }
            let htmlTemplate = 'newUserMail';
            var result = await sendMail(user.email, res, subject, htmlTemplate, context);

        }
    )

}
exports.update = (id, user, res) => {
    db.User.update(user, {
        where: {
            id: id
        }
    }).then(user => {
        res.status(200).send({success: 'User edited successfully'});
    })

}
exports.updatePwd = async (id, newPwd, randomPwd, res) => {
    db.User.update({
        password: newPwd,
    }, {
        where: {
            id: id
        }
    }).then(async user => {
        if (user) {
            const subject = 'New Password';

            const context = {
                userFirstName: user.dataValues.firstName,
                userEmail: user.dataValues.email,
                password: randomPwd
            }
            let htmlTemplate = 'newUserMail';
            var result = await sendMail(user.dataValues.email, res, subject, htmlTemplate, context);
            res.status(200).send(user.dataValues);
        } else {
            res.status(400).send({message :'User not found!'});
        }

    })
}
exports.smartDelete = (id, res) => {

    db.User.update({enabled: false}, {
        where: {
            id: id
        }
    }).then(() => {
            res.status(200).send({success: 'user successfully deactivated'})
        }
    )

}
exports.Delete = (id, res) => {
    db.User.destroy( {
        where: {
            id: id
        }
    }).then(() => {
            res.status(200).send({success: 'user successfully deleted'})
        }
    )

}
exports.upload = async (req, res) => {
    try {
        if (req.file === undefined) {
            return res.status(400).send({message :"Please upload an excel file!"});
        } else {
            const departments = await db.Department.findAll();
            const functions = await db.Function.findAll();
            const roles = await db.Role.findAll();
            const users = await db.User.findAll();
            const skills = await db.Skill.findAll();
            let path =
                __dirname + "../../../public/uploads/" + req.file.filename;
            readXlsxFile(path).then(async (rows) => {
                // skip header
                rows.shift();
                rows.forEach((row) => {
                    let user = users.find(elet => elet.email === row[2])
                    if (row[2] && !user) {
                        let password = generateRandomString();
                        let department = departments.find(elet => elet.name === row[5]);
                        let fct = functions.find(elet => elet.name === row[6]);
                        let role = roles.find(elet => elet.name === row[3].toUpperCase());

                        bcrypt.hash(password, 10).then(async pwd => {
                            if(role && fct && department) {
                                let user = {
                                    firstName: row[0] || '',
                                    lastName: row[1].toUpperCase() || '',
                                    email: row[2],
                                    RoleId: role.id,
                                    company: row[4] ,
                                    FunctionId: fct.id ,
                                    DepartmentId: department.id ,
                                    password: pwd,
                                };
                                const result = await this.create(user, res, password,skills)
                            }
                        })
                    }

                })

                res.status(200).send({
                    message: "Uploaded the file successfully: " + req.file.originalname,
                });
                /*   db.User.bulkCreate(users).then(() => {
                           res.status(200).send({
                               message: "Uploaded the file successfully: " + req.file.originalname,
                           });
                       })
                           .catch((error) => {
                               res.status(500).send({
                                   message: "Fail to import data into database!",
                                   error: error.message,
                               });
                           });
                   */

            });
        }

    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};

