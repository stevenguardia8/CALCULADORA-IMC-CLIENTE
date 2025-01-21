const crypto = require ('crypto');
const dotenv = require('dotenv');
dotenv.config();
const { AES_PRIVATE_KEY } = process.env;

const EncriptarDatos = (JSON_DATA) => {

    const TXT_DATA = JSON.stringify(JSON_DATA);

    // Se obtiene la clave privada AES del entorno y se convierte en un buffer
    const key = Buffer.from(AES_PRIVATE_KEY, 'hex');

    // Se genera un vector de inicialización aleatorio de 16 bytes
    const iv = crypto.randomBytes(16);

    // Se crea un cifrador usando el algoritmo AES-256-GCM, la clave y el IV
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

    // Se encripta el texto en formato UTF-8 y se convierte a hexadecimal
    var encrypted = cipher.update(TXT_DATA, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Se devuelve el IV, la AuthTag y el texto encriptado, separados por ':'
    return iv.toString('hex') + ':' + cipher.getAuthTag().toString('hex') + ':' + encrypted;
}

// Función para descifrar datos encriptados, recibe un string con posibles datos con ":" (un JSON en formato string)
const DesencriptarDatos = (STRING_DATA) => {

    // Se obtiene la clave privada AES del entorno y se convierte en un buffer
    const key = Buffer.from(AES_PRIVATE_KEY, 'hex');

    // Se divide el texto encriptado en partes: IV (vector de inicialización), AuthTag (etiqueta de autenticación) y texto encriptado
    const [ivHex, authTagHex, encryptedHex] = STRING_DATA.split(':');

    // Se convierte el IV en un buffer
    const iv = Buffer.from(ivHex, 'hex');

    // Se convierte la AuthTag en un buffer
    const authTag = Buffer.from(authTagHex, 'hex');

    // Se crea un descifrador usando el algoritmo AES-256-GCM, la clave y el IV
    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv);

    // Se establece la AuthTag para verificar la autenticidad del mensaje
    decipher.setAuthTag(authTag);

    // Se descifra el texto encriptado y se convierte a formato UTF-8
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // Se devuelve el texto descifrado
    return JSON.parse(decrypted);
}

module.exports = {
    EncriptarDatos,
    DesencriptarDatos
}