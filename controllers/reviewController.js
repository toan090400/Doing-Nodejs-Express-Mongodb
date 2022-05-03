const Review = require('../models/reviewModel');
// exports.checkID = (req, res, next, val) => {
//     console.log(`Tour id is: ${val}`);
//     if (req.params.id * 1 > tours.length) {
//         return res.status(404).json({
//             status: 'fail',
//             message: 'Invalid ID'
//         });
//     }
    
//     next();
// };

// exports.checkBody = (req, res, next) => {
//     if (!req.body.name || !req.body.price) {
//         return res.status(400).json({
//             status: 'fail',
//             message: 'Missing name or price'
//         });
//     }
//     console.log(req.body.name);
//     next();
// };


exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find();

        // send respone
        res.status(200).json({
            status: 'success',
            results: reviews.length,
            data: {
                reviews
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

exports.getReview = async (req, res) => {
    try {
        const tours = await Review.findById(req.params.id)
        .populate({
            path: 'tour',
            select: 'name',
        })
        .populate({
            path: 'user',
            select: 'name email',
        });
        // Tour.findOne({_id: req.params.id});
        res.status(200).json({
            status: 'success',
            data: {
                tours
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

exports.createReview = async (req, res) => {
    try {
        const newReview = await Review.create(req.body);
        // console.log(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newReview
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error,
        });
    }
    
};

// exports.updateTour = async (req, res) => {
//     try {
//         const newTour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
//             new: true,
//             runValidators: true,
//         });
//         res.status(200).json({
//             status: 'success',
//             data: {
//                 newTour
//             }
//         });
//     } catch (error) {
//         res.status(404).json({
//             status: 'fail',
//             // message: 'data is null',
//             message: error,
//         });
//     }
    
// };

exports.deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        
        res.status(204).json({
            status: 'success',
            data: "Delete is successfuly"
        });

    } catch (error) {
        res.status(400).json({
            status: 'fail',
            // message: 'data is null',
            message: error,
        });
    }
};