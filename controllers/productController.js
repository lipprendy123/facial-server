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
    },

    async createProduct(req, res)  {
        try {
            if (req.files || req.files.length === 0) {
                res.status(400).json({
                    successs: false,
                    message: 'Image is required'
                })
            }

            const filePaths = req.files.map(file => file.filename)

            const {name, description, price} = req.body

            const data = {
                name,
                productImage: filePaths,
                description,
                price: Number(price)
            }

            const product = await Product.create(data)

           return res.status(201).json({
                success: true,
                message: 'Create data success',
                total: product.length,
                data: product
            })
        } catch (error) {
            return res.status(500).json({
                success: true,
                message: 'Create data failed',
                data : null,            
            })
        }
    },

    async deleteProduct(req, res)  {
        try {
            const {id} = req.params;

            const product = await Product.findOneAndDelete({_id: id})

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'Id product not found',
                    data: null
                })
            }

            return res.status(200).json({
                success: true,
                message: 'Delete data success',
                data: product
            })
        } catch (error) {
             res.status(500).json({
                success: true,
                message: 'Delete data failed',
                data : null,            
            })
        }
    }
}

module.exports = {
    productController
}