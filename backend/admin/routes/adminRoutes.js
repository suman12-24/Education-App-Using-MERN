const express = require('express');
const isAuthenticated = require('../middlewares/authMiddleware'); // Adjust the path as needed
const { controller_render_login, controller_send_otp, controller_verify_otp, controller_logout } = require('../controllers/loginController');
const { controller_view_all_school, controller_school_details, controller_school_approve_deactivate,
    controller_image_approve_deactivate, controller_approve_disapprove_profile_cover_image,
    approve_Disapprove_SuccessStory_image, notification_For_School_Register_Controller,
    school_update_history_controller, delete_notifications_controller, read_notification_controller,
    controller_view_all_approved_school,
    controller_view_all_pending_school,
    school_update_notification } = require('../controllers/schoolController');
const router = express.Router();

//------------------Login logout ----------------------------
router.get('/', controller_render_login);
router.post('/', controller_send_otp);
router.post('/otp-verification', controller_verify_otp);
router.get('/logout', controller_logout);
//--------------- End Login logout---------------------------

//----------------School Route ------------------------------
router.get('/view-all-school', controller_view_all_school);
router.get('/school_view_all_approved', controller_view_all_approved_school);
router.get('/school_view_all_pending', controller_view_all_pending_school);
router.get('/school-details', controller_school_details);
router.post('/approve-deactivate-school', controller_school_approve_deactivate);
router.post('/approve-deactivate-galleryImage', controller_image_approve_deactivate);
router.post('/approve-deactivate-profile-cover-image', controller_approve_disapprove_profile_cover_image);
router.post('/approve-deactivate-SuccessStory-image', approve_Disapprove_SuccessStory_image);
router.post('/notifications', notification_For_School_Register_Controller);
// In your routes file
router.post('/delete-notifications', delete_notifications_controller);
router.post('/update-notification-status', read_notification_controller);
router.get('/school-update-history', school_update_history_controller);
router.get('/school_update_notification', school_update_notification);

//----------------School Route End --------------------------


router.get('/home', isAuthenticated, (req, res) => {
    console.log("sesseion value", req.session.variables["isLoggedIn"].value);
    res.render('pages/home');
});


module.exports = router;
