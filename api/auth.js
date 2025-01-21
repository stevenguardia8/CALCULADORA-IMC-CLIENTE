const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();
const { EncriptarDatos } = require('../Utils/security');
const { URL_API } = process.env;

const IniciarSesion = async (data_json) => {
    try {
        const data = EncriptarDatos(data_json); // Encripta los datos
        const response = await axios.post(`${URL_API}/auth/login`, {data: data}); // Espera la respuesta
        return response.data; // Retorna los datos de la respuesta
    } catch (error) {
        console.error('Error en IniciarSesion:', error.message); // Loguea el error para depuración
        throw error; // Re-lanza el error para que sea manejado en otro nivel
    }
};

const Registrarse = async (data_json) => {
    try {
        const data = EncriptarDatos(data_json); // Encripta los datos
        const response = await axios.post(`${URL_API}/auth/register`, {data: data}); // Espera la respuesta
        return response.data; // Retorna los datos de la respuesta
    } catch (error) {
        console.error('Error en Registrarse:', error.message); // Loguea el error para depuración
        throw error; // Re-lanza el error para que sea manejado en otro nivel
    }
};

module.exports = {
    IniciarSesion,
    Registrarse
};
