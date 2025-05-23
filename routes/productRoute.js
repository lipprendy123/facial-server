const express = require('express');
const {productController} = require('../controllers/productController');
const {uploadMultiple, upload} = require('../middlewares/upload')

const productRoute = express.Router();

productRoute.get('/products', productController.getProduct);
productRoute.post('/products', uploadMultiple ,productController.createProduct);
// productRoute.put('/products/:id', productController.editproduct);
productRoute.delete('/products/:id', productController.deleteProduct);

module.exports = productRoute;