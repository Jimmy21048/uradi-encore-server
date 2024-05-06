const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const conn = require('../config');

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
        conn.query(query1, values1, (err) => {
            if(err) {
                console.log(err);
                return;
            }
            return res.json("Sign Up successful, Login");
        })
    })
})

module.exports = router;