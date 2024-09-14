const express = require('express');
const cors = require('cors');
const conn = require('./config');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: "https://uradi-encore-hotel.vercel.app"
    // origin: "http://localhost:3000"
}))
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, accessToken, roomType, arrive, leave"
      );
      next();
})

app.use(express.json());

app.get('/', (req, res) => {
    res.send("home page");
})
const signupRouter = require('./routes/signup');
app.use('/signup', signupRouter);

const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

const accountRouter = require('./routes/account');
app.use('/account', accountRouter);

const detailsRouter = require('./routes/details');
app.use('/details', detailsRouter);

const foodsRouter = require('./routes/foods');
app.use('/foods', foodsRouter);

conn.connect((err) => {
    if(err) {
        console.log("Could not connect "+ err); 
        return;
    }
    console.log("DB up and running");
    app.listen(process.env.SERVER_PORT , () => {
        console.log("As I live and breath! Server running");
    })
})

