const express = require('express');
const { addSchoolDetailsControllers, sendSchoolLoginOtpControllers, verifySchoolLoginOtpControllers, updateCoverPictureController, updateProfilePictureController, updateGalleryPicturesController, updateNameOfSchoolAndBoardController, deleteCoverPictureController, deleteProfilePictureController, deleteGalleryImageController, addSuccessStoryController, updateSuccessStoryController, deleteSuccessStoryController, getSuccessStoriesController, sendRegisterOtpControllers, verifyRegistrationOtpControllers, getSchoolDetailsControllers, allSchoolsController, fetchSchoolsByBoardController, fetchSchoolByIdController,
    addAboutUsController, updateFacilityIntroduction,
    addOrUpdateFieldsInFacility,
    fetchFacilities,
    updateReachUsController,
    fetchSchoolByIdControllerTwo,
    uploadFeeStructure,
    deleteFeeStructure,
    searchSchoolsController,displaySchoolProfileDetailsController,updateFacilitiesInfoController,updateSocialLinksController,getSocialLinksController,getSchoolViewers } = require('../controllers/schoolControllers');
const upload = require('../helpers/multerConfig'); // Import Multer configuration

const tokenVerificationMiddleware = require('../helpers/tokenVerificationMiddleware');

const router = express.Router()

// School Login Otp Router
router.post('/send-login-otp', sendSchoolLoginOtpControllers);

// School Verify Login Otp Router
router.post('/verify-login-otp', verifySchoolLoginOtpControllers);


// School Registration Otp Router
router.post('/send-registration-otp', sendRegisterOtpControllers);

// School Otp Verify Router
router.post('/verify-registration-otp', verifyRegistrationOtpControllers);

// Get School Details
router.post('/get-school-details', getSchoolDetailsControllers);

// Add School Details Router
router.post('/add-school-details', upload.fields([
    { name: 'coverPicture', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 },
    { name: 'imageGallery', maxCount: 6 },
]), addSchoolDetailsControllers);

// Update Cover Picture
router.post('/update-cover-picture', upload.single('coverPicture'), updateCoverPictureController);

// Delete Cover Picture
router.post('/delete-cover-picture', deleteCoverPictureController);

// Update Profile Picture
router.post('/update-profile-picture', upload.single('profilePicture'), updateProfilePictureController);

// Delete Profile Picture
router.post('/delete-profile-picture', deleteProfilePictureController);

// Update Name of School and Board
router.post('/update-name-of-school-and-board', updateNameOfSchoolAndBoardController);

// Route for updating gallery pictures
router.post('/update-gallery-pictures', upload.array('imageGallery', 6), updateGalleryPicturesController);

// Route for Deleting gallery pictures
router.post('/delete-gallery-pictures', deleteGalleryImageController);


//============================ Achievements Routers =============================//

// Route to add a new success story
router.post('/add-achievement', upload.single('image'), addSuccessStoryController);

// Route to update an existing success story
router.put('/update-achievement', upload.single('image'), updateSuccessStoryController);

// Route to delete a success story
router.delete('/delete-achievement', deleteSuccessStoryController);

// Route to get all success stories
router.get('/show-all-achievement', getSuccessStoriesController);
//===============================================================================//

//============================== add about us====================================//
router.post('/about-us', addAboutUsController)

//===========Fetch a school By Id================//
router.get('/single-school/:id', fetchSchoolByIdController);



//=====================Fetch All School Router===========================//
router.get('/all-schools', allSchoolsController);
// Endpoint for CBSE schools
router.get('/cbse', (req, res, next) => {
    req.query.affiliatedTo = 'CBSE';
    next();
}, fetchSchoolsByBoardController);

// Endpoint for ICSE schools
router.get('/icse', (req, res, next) => {
    req.query.affiliatedTo = 'ICSE';
    next();
}, fetchSchoolsByBoardController);

router.get('/stateBoard', (req, res, next) => {
    req.query.affiliatedTo = '';
    next();
}, fetchSchoolsByBoardController);

// Endpoint for all schools (filter by any board)
router.get('/board-name', fetchSchoolsByBoardController);

//Endpoint for a specific school with id
router.post('/school-by-id', tokenVerificationMiddleware, fetchSchoolByIdControllerTwo);


//====================== Facilities For School==================//

router.post('/update-facility-introduction', updateFacilityIntroduction);
router.post('/add-Fields-to-facility', addOrUpdateFieldsInFacility);
router.post('/fetch-facility-by-email-and-name', fetchFacilities);


//==============================Reach Us=========================//

router.post('/update-reach-us', updateReachUsController);

//==============================Fees Structure Upload=========================//
router.post(
    '/upload-fee-structure', // URL endpoint
    upload.array('files'), // Middleware for handling file uploads
    uploadFeeStructure // Controller to handle the logic after file upload
);

router.post('/fees-structure-delete', deleteFeeStructure);

//=========================School Search ===================
router.post('/all-Schools-Search', searchSchoolsController);

router.post('/school-profile-details', displaySchoolProfileDetailsController);
router.post('/school-facilities-info', updateFacilitiesInfoController);

router.post('/update-social-links', updateSocialLinksController);

// Route to get social links
router.get('/get-social-links', getSocialLinksController);

//Router to fetch school viewer
router.post('/get-school-viewer', getSchoolViewers);

module.exports = router;