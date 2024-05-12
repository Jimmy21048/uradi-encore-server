const express = require('express');
const conn = require('../config');
const { validateToken }  =require('../middleware/authMiddleware');
const {verify} = require('jsonwebtoken');
const { DATE } = require('sequelize');

const router = express.Router();


router.post('/', validateToken, (req, res) => {
    const query0 = "SELECT book_id FROM bookings2 WHERE user_id = ?";
    conn.query(query0, req.user.id, (err, result) => {
        if(err) {
            console.log(err);
            return res.send("Could not complete operation");
        }
        const data = req.body;
        if(result.length >= 3) {
            return res.json({message: "You can only have a maximum of three bookings"});
        }
        const arrive = new Date(data.arrive).getTime();
        const today = new Date().getTime();
        const leave = new Date(data.leave).getTime();

        
        if(arrive < today && (today - arrive) / (1000 * 60 * 60) >= 22) {
            //>=22 allows the hotel 2 hours to prepare the room for another book
            return res.json({message: `CheckIn date should be after or today(${new Date().toLocaleDateString()})`});
        }

        if(arrive > leave) {
            return res.json({message: "CheckOut date should come after CheckIn date"});
        }
        const query1 = "INSERT INTO bookings2 (book_type, book_from, book_to, book_people, book_days, book_amt, user_id, book_status, room_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
        const values1 = [data.type, data.arrive, data.leave, data.people, data.days, data.total, req.user.id, 1, data.room];
    
        conn.query(query1, values1, (err) => {
            if(err) {
                console.log(err);
                return res.send("Could not complete operation");
            }
        })
        res.json("Operation success");
    })

})
router.get('/', validateToken, (req, res) => {

    const query = "SELECT book_id, book_type, book_from, book_to, book_people, book_days FROM bookings2 WHERE user_id = ?";
    const values = [req.user.id];

    conn.query(query, values, (err, result) => {
        if(err) {
            console.log(err);
            return res.send("Could not complete operation");
        }

        const query1 = "SELECT user_fname, user_lname, user_email FROM users WHERE user_id = ?;";
        conn.query(query1, values, (err, result1) => {
            if(err) {
                console.log(err);
                return res.send("Could not complete operation");
            }

            const initials = result1[0].user_fname[0].toUpperCase() + result1[0].user_lname[0].toUpperCase();
            result1[0].initials = initials;
            result1[0].user_fname = result1[0].user_fname.toUpperCase();
            result1[0].user_lname = result1[0].user_lname.toUpperCase();
            res.json({user: result1, userData: result});
        })
        
    })
})
router.post('/bookings', validateToken, (req, res) => {
    const today = new Date()
    const query = "SELECT *  "
})
module.exports = router;