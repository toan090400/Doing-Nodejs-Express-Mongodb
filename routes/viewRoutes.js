const express = require('express');
const viewController = require('../controllers/viewsController');
const authController = require('./../controllers/authController');

const router = express.Router();


router.use(authController.isLoggedIn);

router.get('/loginForm',viewController.loginForm);
router.get('/',viewController.getAllTours);
router.get('/:id',viewController.getTour);
// router
//     .route('/')
//     .get(
//         // authController.isLoggedIn,
//         viewController.getAllTours
//     )
//     //.post(viewController.checkBody,viewController.createTour);

// router
//     .route('/:id')
//     .get(
        
//         viewController.getTour
//     );
//     // .delete(
//     //     authController.protect,
//     //     authController.restrictTo('admin','lead-guide'),
//     //     viewController.deleteTour
//     // );



module.exports = router;