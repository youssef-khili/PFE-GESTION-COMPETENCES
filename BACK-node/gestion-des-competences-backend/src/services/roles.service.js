const db = require('../models');
const readXlsxFile = require("read-excel-file/node");

exports.findAll = (res) => {
    db.Role.findAll({
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
exports.create = (role, res) => {
    db.Role.create(role).then(
        role => {
            if (role) {
                res.status(200).send({success: 'Role added successfully'})
            } else {
                res.status(400).send({message:'Try again !'})
            }
        }
    )

}

exports.update = (id, role, res) => {
    db.Role.update(role, {
        where: {
            id: id
        }
    }).then(role => {
        if (role) {
            res.status(200).send({success: 'Role edited successfully'})
        }

    })

}
exports.smartDelete = (id, res) => {

    db.Role.update({enabled: false}, {
        where: {
            id: id
        }
    }).then(() => {
            res.status(200).send({success: 'Role successfully deleted'})
        }
    )

}
exports.upload = async (req, res) => {
    try {
        if (req.file === undefined) {
            return res.status(400).send("Please upload an excel file!");
        } else {
            let path =
                __dirname + "../../../public/uploads/" + req.file.filename;
            readXlsxFile(path).then(async (rows) => {
                // skip header
                rows.shift();
                rows.forEach((row) => {
                    if (row.length === 2) {
                        let role = {
                            name: row[0].toUpperCase(),
                            description: row[1],
                        };
                        db.Role.create(role);
                    } else {
                        res.status(400).send({message:"All columns in this file shouldn't be empty "})
                    }
                })
                res.status(200).send({
                    message: "Uploaded the file successfully: " + req.file.originalname,
                });
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
};

