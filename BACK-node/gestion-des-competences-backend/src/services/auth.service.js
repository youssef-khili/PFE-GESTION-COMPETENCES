const db = require('../models');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require('dotenv').config({ path: '.env' });
const {sendMail}=require('./mail.service')
const {generateRandomString}=require('./general.service');
exports.login= async (email,password,res)=>{
try{
   await db.User.findOne({
       where : {email : email}, include : [db.Role,db.Function,db.Department],
   }).then(async (user) => {
        if (user) {
            const existingUser =user.dataValues;
            const isAuthenticated = await bcrypt.compare(password, existingUser.password);
            if (isAuthenticated && existingUser.enabled) {
                jwt.sign(
                    {
                        userId: existingUser.id,
                        email: existingUser.email,
                        role: existingUser.Role.name
                    },
                    process.env.JWT_SECRET_KEY,
                    // {expiresIn: "5m"},
                    (err, token) => {
                        res.status(200).send({
                            firstName: existingUser.firstName ,
                            lastName: existingUser.lastName ,
                            email: existingUser.email,
                            role: existingUser.Role.name,
                            company: existingUser.company,
                            function: existingUser.Function.name,
                            department: existingUser.Department.name,
                            token: token
                        });
                    }
                );
            }else {
                res.status(400).send({message: 'Address email or password incorrect'})
            }

        }else {
            res.status(400).send({message: 'Address email or password incorrect'})
        }


    });
}catch (error){
    res.status(400).send({'error':error})
}
}




exports.resetPassword=async (userEmail,res)=>{
    try{
        await db.User.findOne({where : {email : userEmail}}).then(async user => {
            const newPwd = generateRandomString();
            if (user && user.dataValues.enabled) {
                const hashedPassword = await bcrypt.hash(newPwd, 10);
                await db.User.update({password: hashedPassword}, {where: {email: userEmail}}).then(async result => {
                        var mail = await sendResetMail(user, newPwd, res);
                    }
                );
            } else {
                res.status(400).json({message: 'Your address email is incorrect'});
            }
        });


    }catch(e){
        res.status(400).json({error : e});
    }
}


async function sendResetMail(user, pwd, res) {
    const subject = 'Password Reset';

    const context={
        userFirstName: user.firstName,
        userEmail: user.email ,
        password: pwd
    }
    let htmlTemplate = 'resetPwdMail';
    console.log("context",context);
    var result = await sendMail(user.email,res, subject, htmlTemplate,context);

}


