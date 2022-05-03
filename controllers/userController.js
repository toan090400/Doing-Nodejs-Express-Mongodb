const User = require('../models/userModel');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getAllUsers = async (req, res) => {
    try {
        const user = await User.find();
        // console.log(req.body);
        res.status(201).json({
            status: 'success',
            return: user.length,
            data: {
                user,
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error,
        });
    }
    
};

exports.updateMe = async (req, res, next) => {
    try {
        
        // 1) Create error if user POSTs password data
        if (req.body.password || req.body.passwordConfirm) {
            return next('This route is not for password updates. Please use /updateMyPassword.');
        }
        
        // 2) Filtered out unwanted fields names that are not allowed to be updated
        const filteredBody = filterObj(req.body, 'name', 'email');
        
        // 3) Update user document
        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true
        });
        
        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser
            }
        });

    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error,
        });
    }
};

exports.deleteMe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { active: false });
  
        res.status(204).json({
            status: 'success',
            data: null
        });

    } catch (error) {
        res.status(400).json({
            status: 'error',
            message: error,
        });
    }
};

exports.getUser = async (req, res) => {
    try {
        const users = await User.findById(req.params.id);
        // Tour.findOne({_id: req.params.id});
        res.status(200).json({
            status: 'success',
            data: {
                users
            }
        });

    } catch (error) {
        res.status(400).json({
            status: 'fail',
            // message: 'data is null',
            message: error,
            
        });
    }
};

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

exports.updateUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};