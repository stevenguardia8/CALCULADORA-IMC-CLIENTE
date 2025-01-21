const express = require('express');
const { ObtenerHistorialCalculos } = require('../api/getData');
const router = express.Router();
const { VerificarTokenMiddleware } = require('../Middlewares/VerificarTokenSesion');

router.get('/', VerificarTokenMiddleware, async (req, res) => {
    const user = req.user;
    try {
        const query = await ObtenerHistorialCalculos(user.id_usuario, user.token);
        switch (query.status) {
            case 200:
                res.render('historial', {
                    message: { type: 'success', text: 'Bienvenido a tu historial' },
                    resultados: query.data,
                    username: user.username,
                    user: user
                });
                break;

            case 401:
                handleLogout(req, res, {
                    type: 'error',
                    text: 'La sesión ha expirado. Por favor inicia sesión de nuevo.',
                });
                break;

            default:
                res.render('index', {
                    message: { type: 'error', text: 'Error al procesar la respuesta' },
                    resultados: query.data,
                    username: user.username,
                    user: user
                });
                break;
        }
    } catch (error) {
        if (error.message === 'No se envió el token necesario para la operación') {
            return res.status(500).render('historial', {
                message: { type: 'error', text: 'Ocurrió un error al procesar tu solicitud.' },
                resultados: null,
                username: user ? user.username : null,
                user: user ? user : null
            });
        }

    }
});

module.exports = router;