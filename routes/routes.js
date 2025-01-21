const express = require('express');
const router = express.Router();
const index = require('./index');
const login = require('./login');
const signup = require('./signup');
const importante = require('./importante');
const leeme = require('./sobreCalcs');
const calculos = require('./calculos');
const history = require('./history');

router.use('/', index);
router.use('/login', login);
router.use('/send-login', login);
router.use('/signup', signup);
router.use('/send-signup', signup);
router.use('/importante', importante);
router.use('/history', history);
router.use('/calc-bmi', calculos);
router.use('/calc-igc', calculos);
router.use('/leeme', leeme);

module.exports = router;