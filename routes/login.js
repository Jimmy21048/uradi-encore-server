const conn = require('../config');
const bcrypt = require('bcryptjs');
const express = require('express');
// const session = require('express-session');

const router = express.Router();

// const login = {
//     loginPost: (req, res) => {
//         const userData = req.body;

//         const query = "SELECT user_fname, user_lname, user_email, user_pwd FROM users WHERE user_email = ?;";
//         const values = [userData.email];
    
//         conn.query(query, values, async (err, result) => {
//             if(err) {
//                 console.log(err);
//                 res.send("Could not complete operation");
//                 return;
//             } else {
//                 if(result.length === 0) {
//                     res.json("Incorrect email or password");
//                     return;
//                 } else {
//                     const pwdMatch = await bcrypt.compare(userData.pwd, result[0].user_pwd);
//                     if(pwdMatch) {
//                         res.json(true);
//                         req.session.authenticated = true;
//                         // req.session.data = [{...result[0], user_pwd: ""}];
//                     } else {
//                         res.json("Incorrect email or password");
//                         req.session.authenticated = false;
//                     }
//                 }
//             }

//         })
//     }
// }

const {sign} = require('jsonwebtoken');
const { validateToken } = require('../middleware/authMiddleware');
router.post('/', (req, res) => {
    const userData = req.body;

    const query = "SELECT user_id, user_fname, user_lname, user_email, user_pwd FROM users WHERE user_email = ?;";
    const values = [userData.email];

    conn.query(query, values, async (err, result) => {
        if(err) {
            console.log(err);
            return res.send("Could not complete operation");
        }
        if(result.length === 0) {
            return res.json({error: "Incorrect email or password"});
        }
        const pwdMatch = await bcrypt.compare(userData.pwd, result[0].user_pwd);

        if(pwdMatch) {

            const accessToken = sign({fname: result[0].user_fname, lname: result[0].user_lname, id: result[0].user_id}, "myToken", {expiresIn: 1800});
            return res.json(accessToken);
        } else {
            return res.json({error: "Incorrect email or password"});
        }
    })
})
router.get('/auth', validateToken, (req, res) => {
    res.json({
        fname: req.user.fname,
        lname: req.user.lname,
        fnameI: req.user.fname[0].toUpperCase(),
        lnameI: req.user.lname[0].toUpperCase()
    });

})

module.exports = router;