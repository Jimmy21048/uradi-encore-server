const mysql = require('mysql');
require('dotenv');
const conn = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    // port: process.env.PORT

    // host: 'localhost',
    // user: 'root',
    // password: '',
    // database: 'uradi',
    // port: 3306

    
})

module.exports = conn;