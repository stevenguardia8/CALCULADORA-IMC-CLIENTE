const express = require('express');
const { Calcular_BMI, Calcular_ICG } = require('../api/calcs');
const { VerificarToken } = require('../Utils/jwt');
const router = express.Router();

router.post('/', async (req, res) => {
    const baseUrl = req.baseUrl;
    const { weight, waist, hip, neck, height, gender } = req.body;
    const user =  req.user;
    let result_query = null;

    try {

        if(user.token){
            VerificarToken(user.token);
        }

        switch (baseUrl) {
            case '/calc-bmi':
                console.log('CALCULANDO BMI');
                result_query = await Calcular_BMI({ weight, height }, user ? user?.token : null);
                console.log('RESULTADO', result_query);
                break;

            case '/calc-igc':
                console.log('CALCULANDO IGC');
                if (!gender) {
                    return res.status(400).render('index', {
                        message: { type: 'error', text: 'No seleccionaste ningún género' },
                        username: user ? user.username : null,
                        user: user ? user : null
                    });
                }
                result_query = await Calcular_ICG({ weight, waist, hip, neck, height, gender }, user ? user?.token : null);
                console.log('RESULTADO', result_query);
                break;

            default:
                return res.status(404).send({ error: 'Ruta no encontrada' });
        }

        // Verificar si result_query tiene un valor válido
        if (!result_query) {
            return res.status(500).render('index', {
                message: { type: 'error', text: 'No se pudo calcular el resultado' },
                username: user ? user.username : null,
                user: user ? user : null
            });
        }

        // Si llegamos aquí, la consulta fue exitosa
        res.render('index', {
            result: result_query.data,
            message: { type: 'success', text: 'Cálculo completado' },
            username: user ? user.username : null,
            user: user ? user : null
        });

    } catch (error) {
        console.error('Error al hacer la petición:', error);

        if(error.message === 'Token inválido o expirado'){
            res.status(401).render('login', {
                message: { type: 'error', text: 'Sesión expirada, por favor vuelve a iniciar sesión' },
                username: user ? user.username : null,
                user: user ? user : null
            });
        }

        res.status(500).render('index', {
            message: { type: 'error', text: 'Ocurrió un error al procesar tu solicitud.' },
            username: user ? user.username : null,
            user: user ? user : null
        });
    }
});

module.exports = router;