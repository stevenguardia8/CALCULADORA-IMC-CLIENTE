// Función para manejar el logout
async function handleLogout(req, res, message = null) {
    try {
        // Logout del usuario
        await new Promise((resolve, reject) => {
            req.logout((err) => (err ? reject(err) : resolve()));
        });

        // Destruir la sesión
        await new Promise((resolve, reject) => {
            req.session.destroy((err) => (err ? reject(err) : resolve()));
        });

        // Limpiar las cookies relacionadas con la sesión
        res.clearCookie('connect.sid'); // Borra la cookie de sesión
        res.clearCookie('token'); // Borra la cookie del token

        // Renderizar la vista de inicio de sesión con el mensaje proporcionado
        res.render('login', { message });
    } catch (err) {
        console.error('Error al cerrar sesión:', err);
        res.status(500).send('Error al cerrar sesión');
    }
}

module.exports = {
    handleLogout
}