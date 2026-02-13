const express = require('express');
const { addUserDetailsControllers, sendLoginOtpControllers, verifyLoginOtpControllers, guardianEnquiryFormControllers, fetchAddressByPincode, sendRegisterOtpControllers, verifyRegistrationOtpControllers, displayProfileDetailsController, updateEnquiryFormController, updateEnquiryForm, getEnquiryFormIds, getEnquiryDetailsController, getEarliestEnquiryByGuardian, addFavouriteSchoolController, removeFavouriteSchoolController, getFavouriteSchoolsByIds, updateFavouriteSchoolsController, getMostSearchedSchools, getMostViewedSchools } = require('../controllers/userControllers');

const router = express.Router()
const tokenVerificationMiddleware = require('../helpers/tokenVerificationMiddleware');

// User Login Otp Router
router.post('/send-login-otp', sendLoginOtpControllers);

// User Verify Login Otp Router
router.post('/verify-login-otp', verifyLoginOtpControllers);

// User Login Otp Router
router.post('/send-registration-otp', sendRegisterOtpControllers);

// User Login Otp Router
router.post('/verify-registration-otp', verifyRegistrationOtpControllers);


// Fetch address from pin
//router.post('/address-by-pin', tokenVerificationMiddleware, fetchAddressByPincode);
router.post('/address-by-pin', fetchAddressByPincode);

// user details || METHOD POST
router.post('/user-details', addUserDetailsControllers);

// display user details
router.get('/display-Profile-Details', displayProfileDetailsController);

// Routes for enquiry forms
router.post("/enquiry-form", guardianEnquiryFormControllers);

// Routes for update forms
// Update enquiry form by ID
router.put("/update-enquiry/:id", updateEnquiryForm);
router.get('/enquiry-form-ids', getEnquiryFormIds);
router.post("/enquiry-details-for-this-school", getEnquiryDetailsController);
router.get("/default-enquiry-details", getEarliestEnquiryByGuardian);

//=======================add and remove to favourtie ================
router.post("/add-favourite-school", addFavouriteSchoolController);
router.post("/remove-favourite-school", removeFavouriteSchoolController);

router.post("/update-favourite-schools-list", updateFavouriteSchoolsController);
router.post("/get-favourite-schools-by-ids", getFavouriteSchoolsByIds);

router.get("/get-most-search-school", getMostSearchedSchools);
router.get("/get-most-view-school", getMostViewedSchools);

module.exports = router;