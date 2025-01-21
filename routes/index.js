const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const user =  req.user;

    res.render('index', {
        username: user ? user.username : null ,
        user: user ? user : null
    });
});

module.exports = router;