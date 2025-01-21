const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const { URL_API } = process.env;

const ObtenerHistorialCalculos = async (id_usuario, token) => {
    try {
        if (!token) {
            throw new Error('No se envió el token necesario para la operación');
        }

        const response = await axios.get(
            `${URL_API}/get/history/${id_usuario}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Encabezados opcionales
                },
            }
        );
        return response.data; // Retorna los datos de la respuesta
    } catch (error) {
        console.error('Error en ObtenerHistorialCalculos:', error.message); // Loguea el error para depuración
        throw error; // Re-lanza el error para que sea manejado en otro nivel
    }
};

module.exports = {
    ObtenerHistorialCalculos,
};
