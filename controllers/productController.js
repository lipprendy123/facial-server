const Product = require('../models/product_model')

const productController = {
    async getProduct (req, res)  {
        try {
            const product = await Product.find()

            res.status(200).json({
                success: true,
                message: 'Get data success',
                total: product.length,
                data : product,            
            })
        } catch (error) {
            res.status(500).json({
                success: true,
                message: 'Get data failed',
                data : null,            
            })
        }
    }
}

module.exports = {
    productController
}