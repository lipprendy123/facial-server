const express = require("express");
const Service = require("../models/service_model");
const { serviceSchema } = require("../helpers/schema");
const path = require("path");
const fs = require("fs");

const serviceController = {
  async getService(req, res) {
    try {
      const service = await Service.find().populate({ path: "benefits" });

      const imageUrl = process.env.APP_URL + "/public/images/";

      const response = service.map((item) => {
        return {
          ...item.toObject(),
          thumbnail_url:
            item.image.length > 0 ? imageUrl + item.image[0] : null,
        };
      });

      return res.json({
        success: true,
        message: "Get data services successfully",
        data: response,
      });
    } catch (error) {
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Get data services failed",
      });
    }
  },

  async getServiceById(req, res) {
    try {
      const { id } = req.params;

      const service = await Service.findById(id).populate({ path: "benefits" });

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Get data service by id success",
        data: service,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  },

  async createService(req, res) {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "File image is required",
        });
      }

      // Ambil nama file dari req.files
      const filePaths = req.files.map((file) => file.filename);

      // Ambil benefit dari request body
      const { name, description, price, duration, benefits } = req.body;

      // Konversi benefits menjadi array ObjectId
      const benefitsArray = benefits
        ? benefits.split(",").map((id) => id.trim())
        : [];

      console.log("Benefits received:", benefitsArray); // Debugging

      // Buat data dari req.body dan req.files
      const data = {
        name,
        description,
        price: Number(price),
        duration: Number(duration),
        image: filePaths,
        benefits: benefitsArray, // Simpan ID benefit dalam array
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
      const { id } = req.params;

      // Validasi jika file tidak diupload
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: "File image is required",
        });
      }

      // Ambil nama file dari req.files
      const filePaths = req.files.map((file) => file.filename);

      // Konversi benefits menjadi array ObjectId
      const benefits = req.body.benefits
        ? req.body.benefits.split(",").map((id) => id.trim()) // Ubah string ke array
        : [];

      const data = {
        name: req.body.name,
        description: req.body.description,
        benefits: benefits,
        price: Number(req.body.price),
        duration: Number(req.body.duration),
        image: filePaths,
      };

      const service = await Service.findOneAndUpdate({ _id: id }, data, {
        new: true,
      });

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Update data service successfully!!",
        data: service,
      });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Update data service failed",
        error: error.message,
      });
    }
  },

  async deleteService(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid service ID" });
      }

      const service = await Service.findOneAndDelete({ _id: id });

      if (!service) {
        return res.status(404).json({
          success: false,
          message: "Service not found",
        });
      }

      if (Array.isArray(service.image)) {
        service.image.forEach((imageName) => {
          const filePath = path.join(dirname, "public/images", imageName);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }

      res.status(200).json({
        success: true,
        message: "Delete data service successfully!!!",
      });
    } catch (error) {
      console.error("Error:", error.message);
      return res.status(500).json({
        success: false,
        message: "Delete data service failed",
        error: error.message,
      });
    }
  },
};

module.exports = {
  serviceController,
};
