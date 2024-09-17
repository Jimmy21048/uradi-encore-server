const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
require('dotenv').config();

router.post('/', (req, res) => {
    const data = req.body;
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
        to: data.email,
        subject: 'Uradi Encore Hotel & Resort ...Change password',
        text: `Hello user, use code ${data.code.current} to reset your password. Code will expire after 15 minutes. For more information, reach us through the number 0113951657`
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.log(error);
            return res.json({error: "error sending code"});
        } else {
            console.log('email sent' + info.response);
            return res.json({success: "code sent succesfully"});
        }
    })
})

module.exports = router;