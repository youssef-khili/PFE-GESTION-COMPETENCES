const db = require('../models');
const readXlsxFile = require("read-excel-file/node");
exports.findByIds = (req, res) => {
    const skills = req.params.skillsId.split(',');
    db.Skill.findAll({
        where: {id: skills}
    }).then(result => {
        let skillsNames;
        if (result) {
            skillsNames = [];
            result.map(skill => {
                skillsNames.push(skill.name);
            })
            res.status(200).send(skillsNames);
        }
    });
}
exports.selectSkillsNames = (req, res) => {
    db.Skill.findAll({
            attributes: ['name']
        }
    ).then(result => {
        let skillsNames;
        if (result) {
            skillsNames = [];
            result.map(skill => {
                skillsNames.push(skill.name);
            })
            res.status(200).send(skillsNames);
        }
    });
}
exports.findAll = (res) => {
    db.Skill.findAll({
        where: {
            enabled: true
        },
        order: [
            ['createdAt', 'DESC'],
        ],
        include: [db.Function, db.Category]
    }).then(data => {
        res.status(200).send(data);
    })
}
exports.create = (skill, res) => {
    db.Skill.create(skill).then(
        skill => {
            if (skill) {
                createSkillEvalForAllUsers(skill.id);
                res.status(200).send({success: 'Skill added successfully'})
            } else {
                res.status(400).send({message:'Try again !'})
            }
        }
    )

}

exports.update = (id, skill, res) => {
    db.Skill.update(skill, {
        where: {
            id: id
        }
    }).then(skill => {
        if (skill) {
            res.status(200).send({message: "Skill edited successfully"});

        } else {
            res.status(400).send({message:"Try again !"});
        }
    })

}
exports.smartDelete = (id, res) => {

    db.Skill.update({enabled: false}, {
        where: {
            id: id
        }
    }).then(() => {
            res.status(200).send({success: 'Skill successfully deleted'})
        }
    )
}
exports.upload = async (req, res) => {
    try {
        if (req.file === undefined) {
            return res.status(400).send({message:"Please upload an excel file!"});
        } else {
            let path =
                __dirname + "../../../public/uploads/" + req.file.filename;
            const categories = await db.Category.findAll();
            readXlsxFile(path).then(async (rows) => {
                // skip header
                rows.shift();
                let skills =[];
                let totalNbRows= rows.length;
                let nbRowsInsered=0;
                rows.forEach((row) => {
                    let category = categories.find(elet => elet.name === row[1]);
                    if(row[0] && category) {
                        let skill = {
                            name: row[0],
                            categoryId: category.id,
                        };
                        nbRowsInsered ++;
                        skills.push(skill);
                    }
                })
                db.Skill.bulkCreate(skills).then( result =>{
                    if (result){
                        res.status(200).send({
                            message: req.file.originalname +": Uploaded "
                                +nbRowsInsered+"/"+totalNbRows+" rows successfully "  ,
                        });
                    }
                })

            });
        }
    } catch (error) {
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};

function createSkillEvalForAllUsers(skillId) {
    db.User.findAll({
        where: {enabled: true},
        attributes: ['id']
    }).then(async results => {
        const skillsEval = results.map(elet => {
            return {
                skillId: skillId,
                forUser: elet.id
            }
        });
        console.log('skilleval',skillsEval)
        const skilleval = await db.SkillEvaluation.bulkCreate(skillsEval);
    })

}
