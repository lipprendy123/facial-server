const express = require('express');
const Service = require('../models/service_model');
const {serviceSchema} = require('../helpers/schema');

const serviceController = {

    async getService(req, res) {
        try {
            const service = await Service.find();

            return res.json({
                success: true,
                message: 'Get data services successfully',
                data: service
            });

        } catch (error) {
            console.log(error);
            
            return res.status(500).json({
                success: false,
                message: 'Get data services failed'
            })
        }
    },
        
    async createService(req, res) {
        try {
          // console.log("Files in Controller:", req.files); 
          // console.log("Body in Controller:", req.body); 
      
          // Validasi jika file tidak diupload
          if (!req.files || req.files.length === 0) {
            return res.status(400).json({
              success: false,
              message: "File image is required",
            });
          }
      
          // Ambil nama file dari req.files
          const filePaths = req.files.map(file => file.filename);
      
          // Buat data dari req.body dan req.files
          const data = {
            name: req.body.name,
            description: req.body.description,
            price: Number(req.body.price), // Konversi ke Number
            duration: Number(req.body.duration), // Konversi ke Number
            image: filePaths[0], // Ambil file pertama sebagai image utama
          };
      
          // Simpan ke database
          const service = await Service.create(data);
      
            return res.status(201).json({
            success: true,
            message: "Create data service successfully",
            data: service,
          });
        } catch (error) {
          console.error("Error:", error.message);
          return res.status(500).json({
            success: false,
            message: "Create data service failed",
            error: error.message,
          });
        }
      },
      
    async updateService(req, res) {
      try {
        const {id} = req.params;

         // Validasi jika file tidak diupload
         if (!req.files || req.files.length === 0) {
          return res.status(400).json({
            success: false,
            message: "File image is required",
          });
        }

         // Ambil nama file dari req.files
         const filePaths = req.files.map(file => file.filename);

         const data = {
          name: req.body.name,
          description: req.body.description,
          price: Number(req.body.price), 
          duration: Number(req.body.duration), 
          image: filePaths[0], 
        };

        const service = await Service.findOneAndUpdate(
          {_id: id},
          data,
          {new: true}
        )

        if (!service) {
          return res.status(404).json({
            success: false,
            message: 'Service not found'
          })
        }

        return res.status(200).json({
          success: true,
          message: 'Update data service successfully!!',
          data: service
        })

      } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({
          success: false,
          message: "Create data service failed",
          error: error.message,
        });
      }
    },

    async deleteService(req, res) {
      try {
        const {id} = req.params;
        
        const service = await Service.findOneAndDelete({_id: id})

        if (!service) {
          return res.status(404).json({
            success: false,
            message: 'Service not found'
          })
        }

        res.status(200).json({
          success: true,
          message: 'Delete data service successsfully!!!',
        })

      } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({
          success: false,
          message: "Delete data service failed",
          error: error.message,
        });
      }
    }

}

module.exports = {
    serviceController,
}