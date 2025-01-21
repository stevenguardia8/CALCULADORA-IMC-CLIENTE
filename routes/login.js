const express = require('express');
const passport = require('passport');
const router = express.Router();

router.get('/', async (req, res) => {
    let msgError = undefined;

    if (req.session.msg) {
        msgError = req.session.msg;
        req.session.msg = null;   
    }

    // Comprueba si msgError es un objeto vacío previene el bug de {}
    if (typeof msgError === 'object' && Object.keys(msgError).length === 0) {
        msgError = undefined;
    }

    res.render('login', {
        message: msgError ? { type: 'error', text: `${msgError.error}` } : null, 
    });
});

router.post('/',
    passport.authenticate('local',
        {
            failureRedirect: '/login',
            failureFlash: true
        }),
    (req, res) => {
        // Si llega aquí, la autenticación fue exitosa
        const user = req.user; // Esto proviene de la estrategia
        const message = { type: 'success', text: `Bienvenido ${user.username}` };

        res.cookie('token', user.token, { httpOnly: true, secure: false });
        // Puedes renderizar la vista o devolver un JSON con el token
        res.render('index', {
            message,
            username: user.username,
            user: user
        });
    }
);

module.exports = router;