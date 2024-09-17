const express = require('express')
const router = express.Router();
const conn = require('../config');
const bcrypt = require('bcryptjs');


router.post('/', async (req, res) => {
    const data = req.body;
    const hashedPwd = await bcrypt.hash(data.pwd, 8);
    const query = "UPDATE users SET user_pwd = ? WHERE user_email = ?;";
    const values = [hashedPwd, data.email];
    conn.query(query, values, (err) => {
        if(err) {
            return console.log(err);
        }
        return res.json({success: "Password succesfully changed"});

    })
})

module.exports = router;