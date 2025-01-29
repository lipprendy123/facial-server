const express = require('express');
const { serviceController } = require('../controllers/serviceController');
const {upload, uploadMultiple} = require('../middlewares/upload');
const authMiddleware = require('../middlewares/auth');

const serviceRoute = express.Router();

serviceRoute.get('/services', serviceController.getService);
serviceRoute.post('/services', uploadMultiple, serviceController.createService);
serviceRoute.put('/services/:id', uploadMultiple, serviceController.updateService);
serviceRoute.delete('/services/:id', serviceController.deleteService);

module.exports = serviceRoute;