const express = require('express');
const {validateToken} = require('../middleware/authMiddleware');
const conn = require('../config');

const router = express.Router();

router.get('/room', validateToken, (req, res) => {
    const query = "SELECT book_id, book_from, book_to, book_status FROM bookings WHERE book_type = ?";
    const roomDetails = req.roomType;
    const values = [roomDetails.type];

    conn.query(query, values, (err, results) => {
        if(err) {
            console.log(err);
            return res.send("Could not complete operation");
        }
        console.log(results);
        if(results.length > 0) {
            for(let i=0; i<results.length; i++) {
                if(roomDetails.leave < results[i].book_from || roomDetails.arrive > results[i].book_to) {
                    return res.json("Room available");
                }
            }
            return res.json("Room already booked for the above dates");
        } else {
            return res.json("Room available");
        }

        
    })
})

module.exports = router;