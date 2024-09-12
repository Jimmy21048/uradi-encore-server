const express = require('express');
const {validateToken} = require('../middleware/authMiddleware');
const conn = require('../config');

const router = express.Router();

router.get('/room', validateToken, (req, res) => {
    const roomDetails = req.roomType;

    const query0 = "SELECT room_no FROM rooms2 INNER JOIN rooms ON rooms2.room_id = rooms.room_id WHERE room_category = ?";
    const values0 = [roomDetails.type];

    conn.query(query0, values0, (err, results0) => {
        if(err) {
            console.log(err);
            return res.send("Could not complete operation");
        }
        
        const rooms = results0;

        const query = "SELECT book_id, book_from, book_to, book_status, room_no FROM bookings2 WHERE book_type = ? AND book_status = ?";
        const values = [roomDetails.type, 1];
    
        conn.query(query, values, (err, results) => {
            if(err) {
                console.log(err);
                return res.send("Could not complete operation");
            }
            
            if(results.length > 0) {
                for(let x=0; x<rooms.length; x++) {
                    let num = 0;
                    let count = 0;
                    for(let i=0; i<results.length; i++) {
                            num++;
                            if((roomDetails.arrive < results[i].book_from && roomDetails.leave < results[i].book_to && roomDetails.leave > results[i].book_from ||
                                roomDetails.arrive > results[i].book_from && roomDetails.leave > results[i].book_to && roomDetails.arrive < results[i].book_to ||
                                roomDetails.arrive == results[i].book_from && roomDetails.leave == results[i].book_to ||
                                roomDetails.arrive < results[i].book_from && roomDetails.leave > results[i].book_to ||
                                roomDetails.arrive > results[i].book_from && roomDetails.leave < results[i].book_to) && results[i].room_no == rooms[x].room_no) 
                             {
    
                             } else {
                                 count++;
                             }
                    }
                    if(count === num) {
                        return res.json(rooms[x].room_no)
                    }
                }
                return res.json(0)
            } else {
                return res.json(rooms[0].room_no)
            }
    
            
        })
    })
   
})

module.exports = router;