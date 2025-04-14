const db = require("../models");
const readXlsxFile = require("read-excel-file/node");
exports.findAll = (res) => {
    db.Function.findAll({
        where: {
            enabled: true
        },
        order: [
            ['createdAt', 'DESC'],
        ]
    }).then(data => {
        res.status(200).send(data);
    })
}
exports.findAllIncludeDepart = (res) => {
    db.Function.findAll({
        where: {
            enabled: true
        },
        order: [
            ['createdAt', 'DESC'],
        ],
        include:[db.Department]
    }).then(data => {
        res.status(200).send(data);
    })
}
exports.create = (fct, res) => {
    db.Function.create(fct).then(
        fct => {
            if (fct) {
                res.status(200).send({success: 'Function added successfully'})
            } else {
                res.status(400).send({message:'Try again !'})
            }
        }
    )

}

exports.update = (id, fct, res) => {
    db.Function.update(fct, {
        where: {
            id: id
        }
    }).then(fct => {
        if (fct) {
            res.status(200).send({success: 'Function edited successfully'});
        }else {
            res.status(400).send({message:'Try again !'});
        }

    })

}
exports.smartDelete = (id, res) => {

    db.Function.update({enabled: false}, {
        where: {
            id: id
        }
    }).then(result => {
        if(result) {
            res.status(200).send({success: 'Function successfully deleted'})
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
            const departments = await db.Department.findAll();
            readXlsxFile(path).then(async (rows) => {
                // skip header
                rows.shift();
                let functions =[];
                rows.forEach((row) => {
                    let department = departments.find(elet => elet.name === row[1]);
                    if(department) {
                        let fct = {
                            name: row[0],
                            DepartmentId: department.id
                        };
                        functions.push(fct);
                    }
                })
                db.Function.bulkCreate(functions).then( result =>{
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
