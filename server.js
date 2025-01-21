const express = require('express');
const app = express();
const dotenv = require('dotenv'); // Para obtener las variables de entorno
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;
const { IniciarSesion } = require('./api/auth');

// Configurar variables de entorno
dotenv.config();

// Middleware para cookies y sesiones
app.use(cookieParser());
app.use(
    session({
        secret: process.env.ACCESS_TOKEN_SECRET || 'WASAAAA', // Palabra que se usará para cifrar las sesiones
        resave: false,
        saveUninitialized: false,
    })
);
app.use(flash());

// Configurar Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Middleware para pasar mensajes flash a las vistas
app.use((req, res, next) => {
    res.locals.messages = req.flash();
    req.session.msg = res.locals.messages
    next();
});

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    try {
        const data = await IniciarSesion({ email, password });

        if (data.status === 404) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }

        if (data.status === 401) {
            return done(null, false, { message: 'Contraseña incorrecta' });
        }

        if (data.status === 200) {
            // Pasa todos los datos relevantes al siguiente paso
            return done(null, {
                id_usuario: data.id_usuario,
                username: data.username,
                token: data.token
            });
        }
        return done(null, false, { message: 'Error inesperado' });
    } catch (error) {
        return done(null, false, { message: 'Error inesperado' });
    }
}));

// Serialización y deserialización
passport.serializeUser((user, done) => {
    done(null, { id_usuario: user.id_usuario, token: user.token, username: user.username }); // Guarda el id, token y username
});

passport.deserializeUser((user, done) => {
    done(null, user); // Retorna el usuario completo
});


// Medio get para cerrar sesion
app.get('/logout', async (req, res) => {
    await handleLogout(req, res, {            
        type: 'success',
        text: 'Se ha cerrado sesión'
    });
});

// Configuración de la plantilla Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'Views'));

// Middleware para archivos estáticos y procesamiento de solicitudes
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas
const routes = require('./routes/routes');
const { handleLogout } = require('./Utils/closedSession');
app.use('/', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});