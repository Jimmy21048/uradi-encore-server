const express = require('express');
const conn = require('../config');
const { validateToken }  =require('../middleware/authMiddleware');
const {verify} = require('jsonwebtoken');
const { DATE } = require('sequelize');

const router = express.Router();


router.post('/', validateToken, (req, res) => {
    const query0 = "SELECT book_id FROM bookings2 WHERE user_id = ? AND book_status = ?";
    conn.query(query0, [req.user.id, 1], (err, result) => {
        if(err) {
            console.log(err);
            return res.send("Could not complete operation");
        }
        const data = req.body;
        if(result.length >= 3) {
            return res.json({message: "You can only have a maximum of three active bookings"});
        }
        const arrive = new Date(data.arrive).setHours(0,0, 0, 0);
        const today = new Date().setHours(0, 0, 0, 0);
        const leave = new Date(data.leave).setHours(23, 50, 0, 0);




        if(arrive < today ) {
            //>=22 allows the hotel 2 hours to prepare the room for another book
            return res.json({message: `CheckIn date should be after or today(${new Date().toLocaleDateString()})`});
        }

        if(arrive > leave) {
            return res.json({message: "CheckOut date should come after CheckIn date"});
        }
        const query1 = "INSERT INTO bookings2 (book_type, book_from, book_to, book_people, book_days, book_amt, user_id, book_status, room_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);";
        const bookStatus = (arrive > today) ? 0 : 1;
        const values1 = [data.type, data.arrive, data.leave, data.people, data.days, data.total, req.user.id, bookStatus, data.room];
    
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

    const query = "SELECT book_id, book_from, book_to, book_status FROM bookings2 WHERE user_id = ?";
    const values = [req.user.id];

    conn.query(query, values, (err, result) => {
        if(err) {
            console.log(err);
            return res.send("Could not complete operation");
        }
        const tobeUpdated1 = [];
        const tobeUpdated2 = [];
        for(let i in result) {
            if(result[i].book_status === 0 && (new Date(result[i].book_from).setHours(0,0,0,0) <= new Date().setHours(0,0,0,0) && new Date(result[i].book_to).setHours(23, 59, 59) > new Date().setHours(0,0,0,0))) {
                tobeUpdated1.push(result[i].book_id);
            }
            if((result[i].book_status === 1 || result[i].book_status === 0) && (new Date(result[i].book_from).setHours(0, 0, 0, 0) < new Date().setHours(0,0,0,0) && new Date(result[i].book_to).setHours(23, 59, 59) < new Date().setHours(23, 59, 50))) {
                tobeUpdated2.push(result[i].book_id);
            }
        }

        // Independent queries to update the DB when book_status changes
        for(i in tobeUpdated1) {
            const query0a = "UPDATE bookings2 SET book_status = ? WHERE book_id = ? AND user_id = ?;";
            conn.query(query0a,[1, tobeUpdated1[i], req.user.id], (err) => {
                if(err) {
                    console.log(err);
                    return res.send("Could not complete operation");
                }
            })
        }
        for(i in tobeUpdated2) {
            const query0b = "UPDATE bookings2 SET book_status = ? WHERE book_id = ? AND user_id = ?;";
            conn.query(query0b, [2, tobeUpdated2[i], req.user.id], (err) => {
                if(err) {
                    console.log(err);
                    return res.send("Could not complete operation");
                }
            })
        }
        // Independent queries to update the DB when book_status changes

        const query1 = "SELECT user_fname, user_lname, user_email FROM users WHERE user_id = ?;";
        conn.query(query1, values, (err, result1) => {
            if(err) {
                console.log(err);
                return res.send("Could not complete operation");
            }

            

            const query2 = "SELECT order_id, order_name, order_price, room_no, order_date FROM orders WHERE user_id = ? ORDER BY order_id DESC;";
            conn.query(query2, values, (err, result2) => {
                if(err) {
                    console.log(err);
                    return res.send("Could not complete operation");
                }

                const query3 = "SELECT book_id, book_type, book_from, book_to, book_people, book_days, room_no, book_status FROM bookings2 WHERE user_id = ?";
                conn.query(query3, values, (err, result3) => {
                    if(err) {
                        console.log(err);
                        return res.send("Could not complete operation");
                    }

                    const initials = result1[0].user_fname[0].toUpperCase() + result1[0].user_lname[0].toUpperCase();
                    result1[0].initials = initials;
                    result1[0].user_fname = result1[0].user_fname.toUpperCase();
                    result1[0].user_lname = result1[0].user_lname.toUpperCase();
                    res.json({user: result1, userData: result3, orders: result2});
                })

            })
        })
        
    })
})
router.post('/bookings', validateToken, (req, res) => {
    const today = new Date()
    const query = "SELECT *  "
})
module.exports = router;