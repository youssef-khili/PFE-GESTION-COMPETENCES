const nodeMailer = require("nodemailer");
const hbs = require('nodemailer-express-handlebars');
const path = require("path");
const express = require("express");
const viewPath =  path.resolve(__dirname, '../../views/');
require('dotenv').config({ path: '.env' });

exports.sendMail=async (email, res, subject, htmlTemplate, context) => {
    try {
        var transporter = nodeMailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: process.env.ADDRESS_EMAIL,
                pass: process.env.PASSWORD
            }
        });
        transporter.use('compile', hbs({
            viewEngine: {
                extName: '.handlebars',
                layoutsDir: viewPath,
                defaultLayout: false,
                express
            },
            viewPath: viewPath,
            extName: '.handlebars',
        }))
        var mailOptions = {
            to: email,
            from: process.env.ADDRESS_EMAIL,
            subject: subject,
            template:htmlTemplate,
            context:context
        };
        var mail = await transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                res.status(400).send({'error':err});
            } else {
                res.status(200).send({success: "The email sent successfully check your address email " });
            }
        })
    } catch (e) {
       res.status(401).send({'error':e})
    }

}
