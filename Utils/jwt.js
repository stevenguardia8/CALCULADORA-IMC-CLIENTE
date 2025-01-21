const jwt = require('jsonwebtoken');

const { CLAVE_PUBLICA_FOR_TOKENS } = process.env;

const VerificarToken = (token) => {
    if (!CLAVE_PUBLICA_FOR_TOKENS) {
        throw new Error('La clave pública RSA para verificar tokens no está definida');
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, CLAVE_PUBLICA_FOR_TOKENS, {
            algorithms: ['RS256'],
        });
        return decoded; // Información contenida en el token
    } catch (error) {
        throw new Error('Token inválido o expirado');
    }
};

module.exports = {
    VerificarToken
}