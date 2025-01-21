const { handleLogout } = require('../Utils/closedSession');
const { VerificarToken } = require('../Utils/jwt');

const VerificarTokenMiddleware = (req, res, next) => {
    // Obtener el token de las cookies
    const token = req.cookies['token'];

    if (!token) {
        // Si no hay token, redirigir al inicio de sesión
        return handleLogout(req, res, {
            type: 'error',
            text: 'Inicia sesión para poder ver tu historial',
        });
    }

    try {
        // Verificar el token utilizando la función VerificarToken
        const decoded = VerificarToken(token);

        // Agregar información del usuario al objeto `req` para usar en rutas posteriores
        req.data_usuario_token = decoded;

        // Continuar con el siguiente middleware o ruta
        next();
    } catch (error) {
        return handleLogout(req, res, {
            type: 'error',
            text: 'La sesión ha expirado. Por favor inicia sesión de nuevo.',
        });
    }
};

module.exports = {
    VerificarTokenMiddleware
}