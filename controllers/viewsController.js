const User = require('../models/userModel');
const Tour = require('../models/tourModel');

exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();
        res.status(200).render('index',{
            tours
        });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 'fail',
            message: error,
        });

    }
};

exports.getTour = async (req, res) => {
    try {
        
        const tour = await Tour.findById(req.params.id)
        .populate({
            path: 'guides',
            select: '-__v -passwordChangedAt',
        })
        .populate({
            path: 'reviews',
            select: '-__v',
        });

        res.status(200).render('tour',{
            tour,
            // user: req.user
        });

    } catch (error) {
        res.status(400).json({
            status: 'fail',
            // message: 'data is null',
            message: error,
            
        });
    }
};

exports.loginForm = async (req, res) => {
    console.log('run');
    try {
        res.status(200).render('login');

    } catch (error) {
        res.status(400).json({
            status: 'fail',
            // message: 'data is null',
            message: error,
            
        });
    }
};

