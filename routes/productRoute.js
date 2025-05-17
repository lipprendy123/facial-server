const express = require('express');
const {productController} = require('../controllers/productController');

const productRoute = express.Router();

productRoute.get('/products', productController.getProduct);
// productRoute.post('/products', productController.createproduct);
// productRoute.put('/products/:id', productController.editproduct);
// productRoute.delete('/products/:id', productController.deleteproduct);

module.exports = productRoute;