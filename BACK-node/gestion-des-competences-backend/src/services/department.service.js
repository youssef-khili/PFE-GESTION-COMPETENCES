const db = require("../models");
const readXlsxFile = require("read-excel-file/node");
exports.findAll = (res) => {
    db.Department.findAll({
        where: {
            enabled: true
        },
        order: [
            ['createdAt', 'DESC'],
        ],
    }).then(data => {
        res.status(200).send(data);
    })
}
exports.create = (department, res) => {
    db.Department.create(department).then(
        department => {
            if (department) {
                res.status(200).send({success: 'Department added successfully'})
            } else {
                res.status(400).send({message:'Try again !'})
            }
        }
    )

}

exports.update = (id, department, res) => {
    db.Department.update(department, {
        where: {
            id: id
        }
    }).then(department => {
        if (department) {
            res.status(200).send({success: 'Department edited successfully'});
        }else {
            res.status(400).send({message:'Try again !'});
        }

    })

}
exports.smartDelete = (id, res) => {

    db.Department.update({enabled: false}, {
        where: {
            id: id
        }
    }).then(result => {
            if(result) {
                res.status(200).send({success: 'Department successfully deleted'})
            }else {
                res.status(400).send({message:'Try again !'});
            }
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
            readXlsxFile(path).then(async (rows) => {
                // skip header
                rows.shift();
                let departments =[];
                rows.forEach((row) => {
                    if(row[0]) {
                        let department = {
                            name: row[0],
                            description: row[1]
                        };
                        departments.push(department);
                    }
                })
                db.Department.bulkCreate(departments).then( result =>{
                    if (result){
                        res.status(200).send({
                            message: "Uploaded the file successfully: " + req.file.originalname,
                        });
                    }
                })

            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};
