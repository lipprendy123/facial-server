const express = require('express');
const { authController } = require('../controllers/authController');


const authRoute = express.Router();

authRoute.post('/register', authController.register);
authRoute.post('/login', authController.login);
authRoute.post('/logout', authController.logout);
authRoute.get('/', authController.getUser);
authRoute.get('/verify/:token', authController.verifyToken);

module.exports = authRoute;