const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const conn = require('../config');
const nodemailer = require('nodemailer');
require('dotenv').config();

router.get('/',  (req, res) => {
    res.send("this is my page");
})
router.post('/', (req, res) => {
    const userData = req.body;

    const query = "SELECT user_id from users WHERE user_email = ?;";
    const values = [userData.email];
    conn.query(query, values, async (err, result) => {
        if(err) {
            console.log(err);
            return res.send("Could not complete operation");
        }
        if(result.length !== 0) {
            return res.json("Sorry! The Email is already registered");
        }

        const hashedPwd = await bcrypt.hash(userData.pwd, 8);
        const query1 = "INSERT INTO users (user_fname, user_lname, user_email, user_pwd) VALUES (?,?,?,?);";
        const values1 = [userData.fname, userData.lname, userData.email, hashedPwd];
        console.log(process.env.SMTP_USER);
        conn.query(query1, values1, (err) => {
            if(err) {
                console.log(err);
                return;
            }
            let transporter = nodemailer.createTransport({
                host: 'smtp-relay.brevo.com',
                port: 587,
                secure: false,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PWD
                }
            })

            let mailOptions = {
                from: 'uradiencore@gmail.com',
                to: userData.email,
                subject: 'Welcome to Uradi Encore Hotel & Resort',
                text: `Dear ${userData.fname}, you have succesfully created an account with us. Enjoy our services. For any inquiries, contact us on 0113951657 or the email`
            }

            transporter.sendMail(mailOptions, (error, info) => {
                if(error) {
                    console.log(error);
                } else {
                    console.log('email sent' + info.response);
                }
            })
            return res.json("Sign Up successful, Login");
            
        })
    })
})

module.exports = router;