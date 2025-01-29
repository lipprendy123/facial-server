const express = require('express');
const {benefitController} = require('../controllers/benefitController');

const benefitRoute = express.Router();

benefitRoute.get('/benefits', benefitController.getBenefit);
benefitRoute.post('/benefits', benefitController.createBenefit);
benefitRoute.put('/benefits/:id', benefitController.editBenefit);
benefitRoute.delete('/benefits/:id', benefitController.deleteBenefit);

module.exports = benefitRoute;