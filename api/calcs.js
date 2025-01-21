const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const { URL_API } = process.env;

const Calcular_BMI = async (data_json, token) => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {}; // Solo incluye el token si está definido
        const response = await axios.post(
            `${URL_API}/calc/bmi`,
            data_json, // Datos del cuerpo
            { headers } // Encabezados opcionales
        );
        return response.data; // Retorna los datos de la respuesta
    } catch (error) {
        console.error('Error en Calcular_BMI:', error.message); // Loguea el error para depuración
        throw error; // Re-lanza el error para que sea manejado en otro nivel
    }
};

const Calcular_ICG = async (data_json, token) => {
    try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {}; // Solo incluye el token si está definido
        const response = await axios.post(
            `${URL_API}/calc/igc`,
            data_json, // Datos del cuerpo
            { headers } // Encabezados opcionales
        );
        return response.data; // Retorna los datos de la respuesta
    } catch (error) {
        console.error('Error en Calcular_ICG:', error.message); // Loguea el error para depuración
        throw error; // Re-lanza el error para que sea manejado en otro nivel
    }
};

module.exports = {
    Calcular_BMI,
    Calcular_ICG,
};
