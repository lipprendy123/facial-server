const express = require('express');
const { serviceController } = require('../controllers/serviceController');
const {upload, uploadMultiple} = require('../middlewares/upload');
const authMiddleware = require('../middlewares/authMiddleware');

const serviceRoute = express.Router();

serviceRoute.get('/services', serviceController.getService);
serviceRoute.get('/services/:id', serviceController.getServiceById);
serviceRoute.post('/services', uploadMultiple, serviceController.createService);
serviceRoute.put('/services/:id', uploadMultiple, serviceController.updateService);
serviceRoute.delete('/services/:id', serviceController.deleteService);

module.exports = serviceRoute;