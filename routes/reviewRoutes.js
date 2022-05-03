const express = require('express');
const router = express.Router();

const reviewController = require('./../controllers/reviewController');
const authController = require('./../controllers/authController');

// const router = express.Router({ mergeParams: true });

// router.use(authController.protect);

router
    .route('/')
    .get(
        authController.protect,
        reviewController.getAllReviews
    )
    .post(
        authController.protect,
        // reviewController.setTourUserIds,
        reviewController.createReview
    );

router
    .route('/:id')
    .get(reviewController.getReview)
    // .patch(
    //     authController.restrictTo('user', 'admin'),
    //     reviewController.updateReview
    // )
    .delete(
        authController.protect,
        authController.restrictTo('user', 'admin'),
        reviewController.deleteReview
    );

module.exports = router;