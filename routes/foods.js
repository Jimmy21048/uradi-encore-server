const express = require('express')
const router = express.Router();
const { validateToken } = require('../middleware/authMiddleware');
const conn = require('../config');

router.get('/', validateToken, (req, res) => {
    const userData = req.user;

    const query = "SELECT room_no FROM bookings2 WHERE user_id = ? AND book_status = ?";
    const values = [userData.id, 1];

    conn.query(query, values, (err, results) => {
        if(err) {
            console.log(err);
            return res.json("Could not complete operation");
        }
        res.json(results);
    })
})
router.post('/order', validateToken, (req, res) => {
    const foodData = req.body;
    const userData = req.user;
    const today = new Date().toLocaleDateString();

    const query = "INSERT INTO orders (order_name, order_price, room_no, order_date, user_id) VALUES (?, ?, ?, ?, ?)";
    const values = [foodData.foodName, foodData.foodPrice, foodData.room, today, userData.id];

    conn.query(query, values, (err) => {
        if(err) {
            console.log(err);
            return res.json("Could not complete operation");
        }

        // res.json("request succesful");
    })


})

module.exports = router;