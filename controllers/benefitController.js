const express = require('express');
const Benefit = require('../models/benefit_model');

const benefitController = {
    async getBenefit(req, res) {
        try {
            const benefit = await Benefit.find();

            res.status(200).json({
                success: true,
                message: 'Get data benefit successfully',
                data: benefit
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Get data benefit failed'
            })
        }
    },

    async createBenefit(req, res) {
        try {
            const data = {
                name: req.body.name
            };

            const benefit = await Benefit.create(data)

            res.status(201).json({
                success: false,
                message: 'Create data benefit successfully!!',
                data: benefit
            })
        } catch (error) {
            return res.status(501).json({
                success: false,
                message: 'Create data benefit failed'
            })
        }
    },

    async editBenefit(req, res) {
        try {
            const {id} = req.params;

            const data = {
                name: req.body.name
            };

            const benefit = await Benefit.findOneAndUpdate(
                {_id: id},
                data,
                {new: true}
            );

            if (!benefit) {
                return res.status(404).json({
                    success: false,
                    message: 'Benefit not found'
                })
            };

            res.status(200).json({
                success: true,
                message: 'Update data benefit successfully',
                data: benefit
            })

        } catch (error) {
            return res.status(404).json({
                success: false,
                message: 'Update data benefit failed'
            })
        }
    },

    async deleteBenefit(req, res) {
        try {
            const {id} = req.params;
            
            const benefit = await Benefit.findOneAndDelete({_id: id});

            if (!benefit) {
                return res.status(404).json({
                    success: false,
                    message: 'Benefit not found'
                })
            }

            res.status(200).json({
                success: true,
                message: 'Delete data benefit success',
            })
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: 'Delete data benefit failed'
            })
        }
    }    


}

module.exports = {
    benefitController
}