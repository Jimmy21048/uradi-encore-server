const mysql = require('mysql');

const conn = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    // port: process.env.PORT

    // host: "localhost",
    // user: "root",
    // database: "uradi",
    // password: "",
    // port: 3308
})

module.exports = conn;