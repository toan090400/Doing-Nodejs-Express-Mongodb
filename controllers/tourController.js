const Tour = require('../models/tourModel');
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


exports.getAllTours = async (req, res) => {
    try {
        const tours = await Tour.find();

        res.status(200).json({
            status: 'success',
            results: tours.length,
            data: {
                tours
            }
        })

    } catch (error) {
        res.status(400).json({
            status: 'fail',
            // message: 'data is null',
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
        Tour.findOne({_id: req.params.id});
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });

        res.status(200).render('tour',{
            tour
        });

    } catch (error) {
        res.status(400).json({
            status: 'fail',
            // message: 'data is null',
            message: error,
            
        });
    }
};

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);
        // console.log(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        });
    } catch (error) {
        res.status(400).json({
            status: 'fail',
            message: error,
        });
    }
    
};

exports.updateTour = async (req, res) => {
    try {
        const newTour = await Tour.findByIdAndUpdate(req.params.id,req.body,{
            new: true,
            runValidators: true,
        });
        res.status(200).json({
            status: 'success',
            data: {
                newTour
            }
        });
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            // message: 'data is null',
            message: error,
        });
    }
    
};

exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);
        
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


exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } }
            },
            {
                $group: {
                    // _id: null,
                    _id: { $toUpper: '$difficulty' },
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' }
                }
            },
            {
                $sort: { avgPrice: 1 }
            },
            // {
            //   $match: { _id: { $ne: 'EASY' } }
            // }
        ]);
    
        res.status(200).json({
            status: 'success',
            data: {
                stats
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1; // 2021
    
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates'
            },

            {
                $match: {
                    startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                    }
                }
            },

            {
                $group: {
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },

            {
                $addFields: { month: '$_id' }
            },

            {
                $project: {
                    _id: 0
                }
            },

            {
                $sort: { numTourStarts: -1 }
            },

            {
                $limit: 12
            }
        ]);
    
        res.status(200).json({
            status: 'success',
            data: {
                plan
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};