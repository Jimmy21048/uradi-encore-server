const { verify } = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const accessToken = req.header("accessToken");
    req.header("roomType") ? req.roomType = {type: req.header("roomType"), arrive: req.header("arrive"), leave: req.header("leave")} : req.roomType = null;
    if(!accessToken) {
        return res.json({error: "User not logged in!"});
    }

    try {
        const validToken = verify(accessToken, "myToken");
        req.user = validToken;
        if(validToken) {
            return next();
        } else {
            return res.json({error: "Error logging in! Try again"})
        }
    } catch(err) {
        return res.json({error: err});
    }
}

module.exports = { validateToken };