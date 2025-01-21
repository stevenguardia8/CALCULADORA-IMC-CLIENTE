const express = require('express');
const { Registrarse } = require('../api/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('signup', {
    });
});

router.post('/', async (req, res) => {
    const { email, password, conPassword, username } = req.body;

    try {
        const data = await Registrarse({ email, password, conPassword, username });

        let message = null;

        switch (data.status) {
            case 400:
                if (data.msg === 'El correo electrónico ya está registrado') {
                    message = { type: 'error', text: 'El correo electrónico ya está registrado' };
                }
                if (data.msg === 'Contraseñas no coinciden') {
                    message = { type: 'error', text: 'Las contraseñas no coinciden' };
                }
                break;
            case 200:
                if (data.msg === 'Usuario creado correctamente') {
                    message = { type: 'success', text: 'Usuario creado correctamente. Ahora puedes iniciar sesión.' };
                    return  res.render('login', { message });
                }
                break;
            default:
                message = { type: 'error', text: 'Error inesperado en el servidor.' };
        }

        res.render('signup', { message });
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).render('signup', {
            message: { type: 'error', text: 'Ocurrió un error al procesar tu solicitud.' }
        });
    }
});


module.exports = router;