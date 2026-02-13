const deleteImage = require('../helpers/deleteImage');
const deletePdfFile = require('../helpers/deletePdfFile');
const { sendVerificationEmail } = require('../helpers/SendMailHelpers');
const School = require('../models/schoolDetailsModel');
const Notification = require("../models/SchoolNotification");
const SchoolViewLog = require('../models/SchoolViewLog'); // Import the model
const SchoolSearchLog = require('../models/SchoolSearchLog');
const User = require('../models/userModel'); // Import User model
const COOLDOWN_MINUTES = 1;
const JWT = require('jsonwebtoken');
const path = require('path');
//Login Otp send Controller
const sendSchoolLoginOtpControllers = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.send({
                success: false,
                message: 'Email field cannot be left empty',
            })
        }

        console.log("email", email);
        const existingUser = await School.findOne({ loginEmail: email });
        if (!existingUser) {
            res.status(200).send({
                otpStatus: false,
                loginEmail: email,
                message: 'Contact Person is not registered Signup now',
            })
            return;
        }


        const generateRandomNumber = () => Math.floor(1000 + Math.random() * 9000);
        const otp = generateRandomNumber();

        // Route to set a variable with an expiration time  

        const ttl = 300000;
        const otpExpires = Date.now() + parseInt(ttl);
        const emailExpires = Date.now() + parseInt(ttl);

        if (!req.session.variables) {
            req.session.variables = {};
        }
        req.session.variables["generatedOtp"] = { value: otp, expires: otpExpires };
        req.session.variables["email"] = { value: email, expires: emailExpires };
        // console.log(`Variable ${key} set with value ${value} and TTL ${ttl} ms`);

        res.status(200).send({
            success: true,
            Otp: otp,
        })

        //Send Otp to email 
        // sendVerificationEmail(email, otp);

    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            message: 'Error in send-login-otp API',
            error,
        });
    }
}

//Login Otp verify Controller
const verifySchoolLoginOtpControllers = async (req, res) => {
    try {
        const { enteredOtp } = req.body;
        const key = "generatedOtp";
        // console.log("session data :", req.session.variables);
        if (req.session.variables && req.session.variables[key]) {
            //console.log(`Variable ${key}: ${req.session.variables[key].value}`);
            // console.log(enteredOtp);
            //  console.log(req.session.variables[key].value);
            if (enteredOtp == req.session.variables[key].value) {
                // console.log('Otp verification successfull. Loged in Successfully');

                // Existing Email Check........   
                const loginEmail = req.session.variables['email'].value;
                const existingUser = await School.findOne({ loginEmail });
                if (existingUser) {

                    const JWT_SECRET = process.env.JWT_SECRET;
                    console.log('JWT_Secret', JWT_SECRET);
                    const token = await JWT.sign({ _id: existingUser._id }, JWT_SECRET, { expiresIn: '7d' });
                    return res.status(200).send({
                        success: true,
                        message: 'Carrying Token',
                        token: token
                    });
                }

                const data = await new School({ loginEmail }).save();
                console.log(data);
                if (!data) {
                    return res.send({
                        success: false,
                        message: 'Error in Insert Query',
                    })
                }

                const JWT_SECRET = process.env.JWT_SECRET;
                console.log('JWT_Secret', JWT_SECRET);
                const token = await JWT.sign({ _id: data._id }, JWT_SECRET, { expiresIn: '7d' });
                return res.status(200).send({
                    success: true,
                    message: 'Carrying Token',
                    data: data,
                    token: token
                });


            } else {
                return res.status(200).send({
                    success: false,
                    message: 'Invalid OTP Entered',
                });
            }

        } else {
            return res.status(200).send({
                success: false,
                message: 'OTP Expired',
            });

        }





    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            message: 'Error in verify-login-otp api',
            error,
        });
    }
}

// Registration OTP Send Controller
const sendRegisterOtpControllers = async (req, res) => {
    try {
        const { email, userName, phone, location } = req.body;

        // Validate required fields
        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'Email field cannot be left empty',
            });
        }

        if (!phone) {
            return res.status(400).send({
                success: false,
                message: 'Phone field cannot be left empty',
            });
        }

        if (!userName) {
            return res.status(400).send({
                success: false,
                message: 'Name field cannot be left empty',
            });
        }

        if (!location) {
            return res.status(400).send({
                success: false,
                message: 'Location field cannot be left empty',
            });
        }

        // Validate location object structure
        const { RegionName, Pincode, District, StateName } = location;
        if (!RegionName || !Pincode || !District || !StateName) {
            return res.status(400).send({
                success: false,
                message: 'All location fields (RegionName, Pincode, District, StateName) are required',
            });
        }

        // Generate OTP
        const generateRandomNumber = () => Math.floor(1000 + Math.random() * 9000);
        const otp = generateRandomNumber();
        console.log("registration otp", otp);
        // Set expiration times
        const ttl = 300000; // 5 minutes
        const otpExpires = Date.now() + ttl;
        const userInfoExpires = Date.now() + ttl;

        // Store in session
        if (!req.session.variables) {
            req.session.variables = {};
        }
        req.session.variables["generatedOtp"] = { value: otp, expires: otpExpires };
        req.session.variables["email"] = { value: email, expires: userInfoExpires };
        req.session.variables["phone"] = { value: phone, expires: userInfoExpires };
        req.session.variables["userName"] = { value: userName, expires: userInfoExpires };
        req.session.variables["location"] = {
            value: { RegionName, Pincode, District, StateName },
            expires: userInfoExpires
        };

        // Send OTP response
        res.status(200).send({
            success: true,
            Otp: otp,
        });

        // Send OTP to email
        //  sendVerificationEmail(email, otp);

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error in send-register-otp API',
            error,
        });
    }
};

//Registration Otp verify Controller
const verifyRegistrationOtpControllers = async (req, res) => {
    try {
        const { enteredOtp } = req.body;

        if (!enteredOtp) {
            return res.status(400).send({
                success: false,
                message: 'OTP field cannot be left empty',
            });
        }

        // Key for OTP in the session
        const key = "generatedOtp";

        // Check if OTP and session variables exist
        if (req.session.variables && req.session.variables[key]) {
            const storedOtpData = req.session.variables[key];
            const { value: storedOtp, expires: otpExpires } = storedOtpData;

            // Check if OTP has expired
            if (Date.now() > otpExpires) {
                return res.status(400).send({
                    success: false,
                    message: 'OTP has expired',
                });
            }

            // Verify the OTP
            if (enteredOtp == storedOtp) {
                // Retrieve user data from the session
                const email = req.session.variables['email']?.value;
                const phone = req.session.variables['phone']?.value;
                const userName = req.session.variables['userName']?.value;
                const location = req.session.variables['location']?.value;

                const region = location?.RegionName;
                const pin = location?.Pincode;
                const district = location?.District;
                const state = location?.StateName;

                // Validate retrieved data
                if (!email || !phone || !userName) {
                    return res.status(400).send({
                        success: false,
                        message: 'Session data is incomplete or invalid',
                    });
                }

                // Check if the school already exists
                const existingUser = await School.findOne({ loginEmail: email });
                if (existingUser) {
                    const JWT_SECRET = process.env.JWT_SECRET;
                    const token = await JWT.sign(
                        { _id: existingUser._id },
                        JWT_SECRET,
                        { expiresIn: '7d' }
                    );
                    return res.status(200).send({
                        success: true,
                        message: 'User already exists, token generated',
                        token,
                    });
                }

                // Create a new school
                const newSchool = await new School({
                    loginEmail: email,
                    contactPersonPhone: phone,
                    reachUs: {
                        address: { region, pin, district, state }
                    },
                    contactPersonName: userName,
                }).save();

                if (!newSchool) {
                    return res.status(500).send({
                        success: false,
                        message: 'Error saving school data',
                    });
                }

                // Save notification in DB
                const notification = await Notification.create({
                    schoolId: newSchool._id,
                    message: `${newSchool.contactPersonName}'s school has registered.`,
                    status: "unread",
                    timestamp: new Date(),
                });

                // Get the notifyAdmin function from the app instance
                const { notifyAdmin } = req.app.get('socketUtils');

                // Send real-time notification to admins with additional details
                notifyAdmin({
                    _id: notification._id,
                    schoolId: newSchool._id,
                    schoolName: newSchool.contactPersonName,
                    message: notification.message,
                    status: notification.status,
                    timestamp: notification.timestamp
                });

                // Generate JWT token for the new school
                const JWT_SECRET = process.env.JWT_SECRET;
                const token = await JWT.sign(
                    { _id: newSchool._id },
                    JWT_SECRET,
                    { expiresIn: '7d' }
                );

                return res.status(201).send({
                    success: true,
                    message: 'School registered successfully, token generated',
                    data: newSchool,
                    token,
                });
            } else {
                return res.status(400).send({
                    success: false,
                    message: 'Invalid OTP entered',
                });
            }
        } else {
            return res.status(400).send({
                success: false,
                message: 'OTP has expired or is not available',
            });
        }
    } catch (error) {
        console.error('Error in verify-registration-otp API:', error);
        res.status(500).send({
            success: false,
            message: 'An error occurred while verifying the OTP',
            error,
        });
    }
};

//Get School Details Controller
const getSchoolDetailsControllers = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.send({
                success: false,
                message: 'Email field cannot be left empty',
            })
        }

        console.log("email", email);
        const schoolDetails = await School.findOne({ loginEmail: email });
        if (schoolDetails) {
            res.status(200).send({
                success: true,
                schoolDetails: schoolDetails,
                message: 'School Details successfully fetched',
            })
            return;
        }

    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            message: 'Error in Fetch School Details API',
            error,
        });
    }

}

const addSchoolDetailsControllers = async (req, res) => {
    try {
        const {
            name,
            affiliatedTo,
            admissionProcedure,
            facilities,
            reachUs
        } = req.body;

        if (!name || !affiliatedTo) {
            return res.status(400).json({
                success: false,
                message: "Name and affiliatedTo are required fields."
            });
        }

        // Extract file paths for images
        const coverPicture = req.files?.coverPicture?.[0]?.path;
        const profilePicture = req.files?.profilePicture?.[0]?.path;
        const imageGallery = req.files?.imageGallery?.map(file => file.path);

        const parseJSON = (data, defaultValue) => {
            try {
                return JSON.parse(data);
            } catch {
                return defaultValue;
            }
        };

        // Parse JSON fields safely
        const admissionProcedureParsed = parseJSON(admissionProcedure, {});
        const facilitiesParsed = parseJSON(facilities, {});
        const reachUsParsed = parseJSON(reachUs, {});

        const successStory = Array.isArray(req.body.successStory)
            ? req.body.successStory
            : [];

        // Create a new school document
        const school = new School({
            name,
            affiliatedTo,
            admissionProcedure: admissionProcedureParsed,
            facilities: facilitiesParsed,
            reachUs: reachUsParsed,
            coverPicture,
            profilePicture,
            imageGallery,
            successStory,
        });

        // Save the new school document to the database
        await school.save();

        // Send success response
        res.status(201).json({
            success: true,
            message: 'School created successfully',
            school,
        });

    } catch (error) {
        console.error('Error creating school:', error.message);
        res.status(500).json({
            success: false,
            message: 'Error creating school',
            error: error.message,
        });
    }
};

// Controller to update the cover photo
const updateCoverPictureController = async (req, res) => {
    try {
        const { loginEmail } = req.body;

        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Extract the file name from the uploaded file path
        const coverPicture = {
            image: path.basename(req.file.path),
            isApproved: false, // New cover picture starts with not approved
        };

        // Find the school record to check if it already has a cover picture
        const school = await School.findOne({ loginEmail });

        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }

        // Check if there is an existing cover picture and delete it
        if (school.coverPicture && school.coverPicture.image) {
            console.log('Existing cover picture:', school.coverPicture.image);
            await deleteImage(school.coverPicture.image);
        }

        // Update the school with the new cover picture
        const updatedSchool = await School.findOneAndUpdate(
            { loginEmail },
            { coverPicture }, // Update the cover picture field with the new structure
            { new: true }
        );

        // Respond with the updated document
        res.status(200).json({
            success: true,
            message: 'Cover photo updated successfully',
            school: updatedSchool,
        });
    } catch (error) {
        console.error('Error updating cover photo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to delete the cover picture
const deleteCoverPictureController = async (req, res) => {
    try {
        const { loginEmail } = req.body;

        // Find the school record
        const school = await School.findOne({ loginEmail });

        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }

        // Check if a cover picture exists
        if (school.coverPicture && school.coverPicture.image) {
            console.log('Deleting cover picture:', school.coverPicture.image);

            // Delete the image file
            await deleteImage(school.coverPicture.image);

            // Remove the coverPicture field from the document
            school.coverPicture = null;

            // Save the updated school document
            await school.save();

            // Respond with success
            return res.status(200).json({
                success: true,
                message: 'Cover picture deleted successfully',
                school,
            });
        } else {
            return res.status(400).json({ error: 'No cover picture to delete' });
        }
    } catch (error) {
        console.error('Error deleting cover picture:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to update profile picture
const updateProfilePictureController = async (req, res) => {
    try {
        const { loginEmail } = req.body;

        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Extract the file name from the uploaded file path
        const profilePicture = {
            image: path.basename(req.file.path),
            isApproved: false, // New profile picture starts with not approved
        };

        // Find the school record to check if it already has a profile picture
        const school = await School.findOne({ loginEmail });

        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }

        // Check if there is an existing profile picture and delete it
        if (school.profilePicture && school.profilePicture.image) {
            console.log('Existing profile picture:', school.profilePicture.image);
            await deleteImage(school.profilePicture.image);
        }

        // Update the school with the new profile picture
        const updatedSchool = await School.findOneAndUpdate(
            { loginEmail },
            { profilePicture }, // Update the profile picture field with the new structure
            { new: true }
        );

        // Respond with the updated document
        res.status(200).json({
            success: true,
            message: 'Profile photo updated successfully',
            school: updatedSchool,
        });
    } catch (error) {
        console.error('Error updating profile photo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//Controller to Delete profile picture
const deleteProfilePictureController = async (req, res) => {
    try {
        const { loginEmail } = req.body;

        // Find the school record
        const school = await School.findOne({ loginEmail });

        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }

        // Check if a profile picture exists
        if (school.profilePicture && school.profilePicture.image) {
            console.log('Deleting profile picture:', school.profilePicture.image);

            // Delete the image file
            await deleteImage(school.profilePicture.image);

            // Remove the profilePicture field from the document
            school.profilePicture = null;

            // Save the updated school document
            await school.save();

            // Respond with success
            return res.status(200).json({
                success: true,
                message: 'Profile picture deleted successfully',
                school,
            });
        } else {
            return res.status(400).json({ error: 'No profile picture to delete' });
        }
    } catch (error) {
        console.error('Error deleting profile picture:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const updateNameOfSchoolAndBoardController = async (req, res) => {
    try {
        const { loginEmail, name, affiliatedTo, HSAffiliatedTo } = req.body;
        console.log(HSAffiliatedTo);
        // Validate input
        if (!loginEmail) {
            return res.status(400).json({ error: 'loginEmail is required' });
        }
        if (!name) {
            return res.status(400).json({ error: 'School name is required' });
        }
        if (!affiliatedTo) {
            return res.status(400).json({ error: 'Affiliated board is required' });
        }

        // Find and update the school record
        const updatedSchool = await School.findOneAndUpdate(
            { loginEmail },
            { name, affiliatedTo, HSAffiliatedTo },
            { new: true }
        );

        if (!updatedSchool) {
            return res.status(404).json({ error: 'School not found' });
        }

        // Respond with the updated document
        res.status(200).json({
            message: 'School name and affiliated board updated successfully',
            school: updatedSchool,
        });
    } catch (error) {
        console.error('Error updating school name and board:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//=========================== add about School=========================

const addAboutUsController = async (req, res) => {
    try {
        const { loginEmail, aboutSchool } = req.body;

        // Validate required fields
        if (!loginEmail || !aboutSchool) {
            return res.status(400).json({
                success: false,
                message: "loginEmail and aboutUsText are required fields.",
            });
        }

        // Check if the school exists by loginEmail
        const school = await School.findOne({ loginEmail });

        if (!school) {
            return res.status(404).json({
                success: false,
                message: "School not found for the provided loginEmail.",
            });
        }

        // Update the About Us text for the school (map it to aboutSchool field)
        school.aboutSchool = aboutSchool;

        // Save the updated school document
        await school.save();

        // Send success response
        res.status(200).json({
            success: true,
            message: "About Us updated successfully.",
            school,
        });
    } catch (error) {
        console.error("Error updating About Us:", error.message);
        res.status(500).json({
            success: false,
            message: "Error updating About Us.",
            error: error.message,
        });
    }
};


//========================== Gallery Sections=================//

// update galary image controller
const updateGalleryPicturesController = async (req, res) => {
    try {
        const { loginEmail, replaceExisting = false } = req.body;

        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Extract the file names from the uploaded files and set `isApproved` to false
        const newGalleryPictures = req.files.map((file) => ({
            image: path.basename(file.path),
            isApproved: false,
        }));

        // Find the school record
        const school = await School.findOne({ loginEmail });

        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }

        // Handle existing gallery pictures based on `replaceExisting` flag
        let updatedGallery = [];
        if (replaceExisting) {
            // Delete existing gallery pictures if replacing
            if (school.imageGallery && school.imageGallery.length > 0) {
                console.log('Deleting existing gallery pictures:', school.imageGallery);
                for (const existingImage of school.imageGallery) {
                    await deleteImage(existingImage.image); // Ensure deleteImage handles image deletion logic
                }
            }
            updatedGallery = newGalleryPictures; // Replace with new images
        } else {
            // Append new images to the existing gallery
            updatedGallery = [...school.imageGallery, ...newGalleryPictures];
        }

        // Update the school with the updated gallery
        school.imageGallery = updatedGallery;
        const updatedSchool = await school.save();

        // Respond with the updated document
        res.status(200).json({
            success: true,
            message: 'Gallery pictures updated successfully',
            school: updatedSchool,
        });
    } catch (error) {
        console.error('Error updating gallery pictures:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// delete individual gallery image controller
const deleteGalleryImageController = async (req, res) => {
    try {
        const { loginEmail, imageName } = req.body;

        // Validate inputs
        if (!loginEmail || !imageName) {
            return res.status(400).json({ error: 'Login email and image name are required' });
        }

        // Find the school record
        const school = await School.findOne({ loginEmail });

        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }

        // Check if the gallery contains the image to delete
        const imageIndex = school.imageGallery.findIndex(
            (img) => img.image === imageName
        );

        if (imageIndex === -1) {
            return res.status(404).json({ error: 'Image not found in the gallery' });
        }

        // Delete the image file
        await deleteImage(imageName);

        // Remove the image from the gallery array
        school.imageGallery.splice(imageIndex, 1);

        // Save the updated school document
        const updatedSchool = await school.save();

        // Respond with success
        res.status(200).json({
            message: 'Gallery image deleted successfully',
            school: updatedSchool,
        });
    } catch (error) {
        console.error('Error deleting gallery image:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
//============================================================//

//========================== Achievements Sections=================//
// Add Success Story
const addSuccessStoryController = async (req, res) => {
    try {
        const { loginEmail, title, description } = req.body;

        if (!req.file) {
            return res.status(400).json({ error: 'No image file uploaded' });
        }

        const newStory = {
            image: {
                name: path.basename(req.file.path),
                isApproved: false, // New images are not approved by default
            },
            title,
            description,
        };

        const school = await School.findOne({ loginEmail });
        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }

        school.successStories.push(newStory);
        await school.save();

        res.status(200).json({
            message: 'Success story added successfully',
            successStories: school.successStories,
        });
    } catch (error) {
        console.error('Error adding success story:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update Success Story
const updateSuccessStoryController = async (req, res) => {
    try {
        const { loginEmail, storyId, title, description } = req.body;

        const school = await School.findOne({ loginEmail });
        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }

        const story = school.successStories.id(storyId);
        if (!story) {
            return res.status(404).json({ error: 'Success story not found' });
        }

        if (title) story.title = title;
        if (description) story.description = description;

        if (req.file) {
            // Delete old image if a new one is uploaded
            if (story.image && story.image.name) {
                await deleteImage(story.image.name);
            }
            story.image = {
                name: path.basename(req.file.path),
                isApproved: false, // Reset approval status for new image
            };
        }

        await school.save();

        res.status(200).json({
            message: 'Success story updated successfully',
            successStory: story,
        });
    } catch (error) {
        console.error('Error updating success story:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete Success Story
// Delete Success Story
const deleteSuccessStoryController = async (req, res) => {
    try {
        const { loginEmail, storyId } = req.body;

        // Find the school by loginEmail
        const school = await School.findOne({ loginEmail });
        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }

        // Find the story to be deleted
        const storyIndex = school.successStories.findIndex(
            (story) => story._id.toString() === storyId
        );
        if (storyIndex === -1) {
            return res.status(404).json({ error: 'Success story not found' });
        }

        const story = school.successStories[storyIndex];
        console.log(story.image.name);
        // Delete the image file associated with the story
        if (story.image && story.image.name) {
            await deleteImage(story.image.name); // Ensure this function handles file deletion logic
        }

        // Remove the story from the array
        school.successStories.splice(storyIndex, 1);

        // Save the updated school document
        await school.save();

        res.status(200).json({
            message: 'Success story deleted successfully',
            successStories: school.successStories,
        });
    } catch (error) {
        console.error('Error deleting success story:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};



// Get All Success Stories
const getSuccessStoriesController = async (req, res) => {
    try {
        const { loginEmail } = req.query;

        // Find the school
        const school = await School.findOne({ loginEmail });

        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }

        res.status(200).json({
            message: 'Success stories fetched successfully',
            successStories: school.successStories,
        });
    } catch (error) {
        console.error('Error fetching success stories:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//==================Fetch School By its id============
const fetchSchoolByIdController = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the school by ID
        const school = await School.findById(id);

        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }

        res.status(200).json({
            message: 'School fetched successfully',
            school,
        });
    } catch (error) {
        console.error('Error fetching school by ID:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


//================= Fetch All School Details=========
const allSchoolsController = async (req, res) => {
    try {
        // Optional filters from query parameters
        const { isApprovedByAdmin, page = 1, limit = 10 } = req.query;

        // Build query object
        const query = {};
        if (isApprovedByAdmin !== undefined) {
            query.isApprovedByAdmin = isApprovedByAdmin === 'true';
        }

        // Fetch schools with pagination
        const schools = await School.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Count total schools for pagination info
        const totalSchools = await School.countDocuments(query);

        res.status(200).json({
            message: 'Schools fetched successfully',
            schools,
            pagination: {
                total: totalSchools,
                page: parseInt(page),
                limit: parseInt(limit),
            },
        });
    } catch (error) {
        console.error('Error fetching schools:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const fetchSchoolsByBoardController = async (req, res) => {
    try {
        const { affiliatedTo, page = 1, limit = 10 } = req.query;

        // Define filter condition to exclude CBSE and ICSE schools
        let filter = {};


        // If affiliatedTo is provided, use it
        if (affiliatedTo) {
            filter.affiliatedTo = affiliatedTo;
        } else {
            // If no specific board is requested, exclude CBSE and ICSE
            filter.affiliatedTo = { $nin: ['CBSE', 'ICSE'] };
        }

        // Fetch schools with pagination
        const schools = await School.find(filter)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        // Count total documents for pagination
        const total = await School.countDocuments(filter);

        res.status(200).json({
            message: 'Schools fetched successfully',
            schools,
            pagination: {
                total,
                page,
                limit,
            },
        });
    } catch (error) {
        console.error('Error fetching schools:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

//============================= Controller For Facilities===========================


const fetchSchoolByIdControllerTwo = async (req, res) => {
    try {
        const { schoolId, source } = req.body;
        const userId = req.user?._id;

        console.log("userId", userId);

        if (!schoolId) {
            return res.send({
                success: false,
                message: "Id is not sent to fetchSchoolsByBoardController",
            });
        }

        // Fetch school by ID
        const getSchoolDetail = await School.findById(schoolId);
        if (!getSchoolDetail) {
            return res.send({
                success: false,
                message: "No school found by id",
            });
        }

        const now = new Date();
        const cooldownTime = new Date(now.getTime() - COOLDOWN_MINUTES * 60000);

        // Fetch user details if userId exists
        let userDetails = null;
        if (userId) {
            userDetails = await User.findById(userId);
            if (!userDetails) {
                console.log("User not found with ID:", userId);
            }
        }

        // ------------------------- View Tracking -------------------------
        if (userId && userDetails) {
            const existingLog = await SchoolViewLog.findOne({ userId, schoolId });

            let shouldIncrementView = false;

            if (existingLog) {
                if (existingLog.lastViewedAt < cooldownTime) {
                    existingLog.viewCount += 1;
                    existingLog.lastViewedAt = now;

                    // Add/update user details to the log
                    existingLog.userName = userDetails.name || '';
                    existingLog.userEmail = userDetails.email || '';
                    existingLog.userPhone = userDetails.phone || '';

                    await existingLog.save();
                    shouldIncrementView = true;
                }
            } else {
                // Create new log with user details
                await SchoolViewLog.create({
                    userId,
                    schoolId,
                    userName: userDetails.name || '',
                    userEmail: userDetails.email || '',
                    userPhone: userDetails.phone || ''
                });
                shouldIncrementView = true;
            }

            if (shouldIncrementView) {
                await School.findByIdAndUpdate(schoolId, { $inc: { viewCount: 1 } });
            }
        }

        // ------------------------ Search Tracking ------------------------
        if (source === "SearchSchool" && userId && userDetails) {
            const existingSearchLog = await SchoolSearchLog.findOne({ userId, schoolId });

            if (existingSearchLog) {
                if (existingSearchLog.searchedAt < cooldownTime) {
                    existingSearchLog.searchCount += 1;
                    existingSearchLog.searchedAt = now;
                    existingSearchLog.lastSearchedAt = now;

                    // Add/update user details to the search log
                    existingSearchLog.userName = userDetails.name || '';
                    existingSearchLog.userEmail = userDetails.email || '';
                    existingSearchLog.userPhone = userDetails.phone || '';

                    await existingSearchLog.save();

                    await School.findByIdAndUpdate(schoolId, { $inc: { searchViewCount: 1 } });
                }
                // else: searched recently, skip
            } else {
                // Create new search log with user details
                await SchoolSearchLog.create({
                    userId,
                    schoolId,
                    searchedAt: now,
                    lastSearchedAt: now,
                    userName: userDetails.name || '',
                    userEmail: userDetails.email || '',
                    userPhone: userDetails.phone || ''
                });
                await School.findByIdAndUpdate(schoolId, { $inc: { searchViewCount: 1 } });
            }
        }

        // -------------------------- Response --------------------------
        return res.send({
            success: true,
            message: "School Details Found",
            schoolDetails: getSchoolDetail,
        });

    } catch (error) {
        console.error("Error occurred in fetchSchoolById Controller:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const updateFacilityIntroduction = async (req, res) => {
    const { loginEmail, facilityName, introduction } = req.body;

    // Input validation
    if (!loginEmail || !facilityName || !introduction) {
        return res.status(400).json({
            error: 'Missing required fields: loginEmail, facilityName, introduction',
        });
    }

    try {
        // Check if the facility exists in the facilities object
        const validFacilities = [
            'ArtsAndCreativity',
            'AcademicFacilities',
            'SportsAndRecreation',
            'SafetyAndHygiene',
            'MentalSupport',
            'ConvenienceFacilities',
            'OutdoorLearning',
            'ScienceInnovation',
        ];

        // Ensure the facilityName is valid
        if (!validFacilities.includes(facilityName)) {
            return res.status(400).json({
                error: `Invalid facility name. Valid options are: ${validFacilities.join(', ')}`,
            });
        }

        // Update the introduction for the specified facility
        const result = await School.updateOne(
            {
                loginEmail, // Match the school by loginEmail
            },
            {
                $set: {
                    [`facilities.${facilityName}.introduction`]: introduction, // Update introduction for the matched facility
                },
            }
        );

        // Check if any document was matched and updated
        if (result.matchedCount === 0) {
            return res.status(404).json({ error: 'School not found' });
        }

        res.status(200).json({
            message: 'Facility introduction updated successfully',
        });
    } catch (error) {
        console.error('Error updating facility introduction:', error);
        res.status(500).json({
            error: 'Internal server error',
        });
    }
};

const addOrUpdateFieldsInFacility = async (req, res) => {
    const { loginEmail, facilityName, fields } = req.body;
    // Input validation
    if (!loginEmail || !facilityName || !fields || !Array.isArray(fields)) {
        return res.status(400).json({
            error: 'Missing required fields: loginEmail, facilityName, fields (Array)',
        });
    }

    try {
        // Check if the facility exists in the facilities object
        const validFacilities = [
            'ArtsAndCreativity',
            'AcademicFacilities',
            'SportsAndRecreation',
            'SafetyAndHygiene',
            'MentalSupport',
            'ConvenienceFacilities',
            'OutdoorLearning',
            'ScienceInnovation',
        ];

        // Ensure the facilityName is valid
        if (!validFacilities.includes(facilityName)) {
            return res.status(400).json({
                error: `Invalid facility name. Valid options are: ${validFacilities.join(', ')}`,
            });
        }

        // Replace the fields array for the given facility
        const updateResult = await School.updateOne(
            {
                loginEmail, // Match the school by loginEmail
            },
            {
                $set: {
                    [`facilities.${facilityName}.fields`]: fields, // Replace the fields array
                },
            }
        );

        // Check if the update was successful
        // if (updateResult.modifiedCount === 0) {
        //     return res.status(400).json({
        //         error: 'Failed to update the fields array. The facility might not exist.',
        //     });
        // }

        res.status(200).json({
            success: 'true',
            message: 'Facility fields replaced successfully',
        });
    } catch (error) {
        console.error('Error replacing fields in facility:', error);
        res.status(500).json({
            error: 'Internal server error',
        });
    }
};

const fetchFacilities = async (req, res) => {
    const { loginEmail, facilityName } = req.body;

    // Input validation
    if (!loginEmail || !facilityName) {
        return res.status(400).json({
            error: 'Missing required fields: loginEmail, facilityName',
        });
    }

    try {
        // Fetch all facilities matching loginEmail and facilityName
        const facilities = await School.find(
            {
                loginEmail, // Match by loginEmail
                [`facilities.${facilityName}`]: { $exists: true }, // Ensure facilityName exists
            },
            { [`facilities.${facilityName}`]: 1, _id: 0 } // Project only the requested facilities
        );

        if (!facilities.length) {
            return res.status(404).json({
                error: 'No facilities found for the given loginEmail and facilityName',
            });
        }

        res.status(200).json({
            success: 'true',
            message: 'Facilities fetched successfully',
            facility: facilities.map((facility) => facility.facilities[facilityName]),
        });
    } catch (error) {
        console.error('Error fetching facilities:', error);
        res.status(500).json({
            error: 'Internal server error',
        });
    }
};


//========================= Address Section Controller ==================//
const updateReachUsController = async (req, res) => {
    try {
        const { loginEmail, address, website, phones, emails } = req.body;

        // Validate the required loginEmail field
        if (!loginEmail) {
            return res.status(400).json({
                success: false,
                message: "loginEmail is a required field.",
            });
        }

        // Prepare the update object
        const updateFields = {};

        if (address) {
            const { street, region, district, pin, state, googleLocation } = address;
            updateFields["reachUs.address.street"] = street;
            updateFields["reachUs.address.region"] = region;
            updateFields["reachUs.address.pin"] = pin;
            updateFields["reachUs.address.district"] = district;
            updateFields["reachUs.address.state"] = state;

            if (googleLocation) {
                if (googleLocation.latitude !== undefined) {
                    updateFields["reachUs.address.googleLocation.latitude"] = googleLocation.latitude;
                }
                if (googleLocation.longitude !== undefined) {
                    updateFields["reachUs.address.googleLocation.longitude"] = googleLocation.longitude;
                }
            }
        }

        if (website !== undefined) updateFields["reachUs.website"] = website;
        if (phones !== undefined) updateFields["reachUs.phones"] = phones;
        if (emails !== undefined) updateFields["reachUs.emails"] = emails;

        // Update the school record
        const updatedSchool = await School.findOneAndUpdate(
            { loginEmail },
            { $set: updateFields },
            { new: true } // Return the updated document
        );

        if (!updatedSchool) {
            return res.status(404).json({
                success: false,
                message: "School not found for the provided loginEmail.",
            });
        }

        // Send success response
        res.status(200).json({
            success: true,
            message: "School address updated successfully.",
            school: updatedSchool,
        });
    } catch (error) {
        console.error("Error updating school address:", error.message);
        res.status(500).json({
            success: false,
            message: "Error updating school address.",
            error: error.message,
        });
    }
};

//===========================Fees Structure Upload=========================//
const uploadFeeStructure = async (req, res) => {
    try {
        const { loginEmail, replaceExisting } = req.body;

        // Check if files were uploaded
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No PDF files uploaded' });
        }

        // Validate and filter PDF files
        const newFeeStructureFiles = req.files
            .filter((file) => path.extname(file.originalname).toLowerCase() === '.pdf')
            .map((file) => ({
                fileName: path.basename(file.path), // Store the file name
                isApproved: false, // Default approval status
            }));

        if (newFeeStructureFiles.length === 0) {
            return res.status(400).json({ error: 'No valid PDF files uploaded' });
        }

        // Find the school record
        const school = await School.findOne({ loginEmail });

        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }

        // Handle existing fee structure PDFs based on replaceExisting flag
        let updatedFeeStructure = [];
        if (replaceExisting) {
            // Delete existing fee structure PDFs if replacing
            if (school.feeStructure && school.feeStructure.length > 0) {
                console.log('Deleting existing fee structure files:', school.feeStructure);
                for (const existingFile of school.feeStructure) {
                    await deletePdfFile(existingFile.fileName); // Delete file using the utility
                }
            }
            updatedFeeStructure = newFeeStructureFiles; // Replace with new PDFs
        } else {
            // Append new PDFs to the existing fee structure
            updatedFeeStructure = [...school.feeStructure, ...newFeeStructureFiles];
        }

        // Update the school record with the updated fee structure
        school.feeStructure = updatedFeeStructure;
        const updatedSchool = await school.save();

        // Respond with the updated document
        res.status(200).json({
            success: true,
            message: 'Fee structure updated successfully',
            school: updatedSchool,
        });
    } catch (error) {
        console.error('Error updating fee structure:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteFeeStructure = async (req, res) => {
    try {
        const { loginEmail, fileName } = req.body;

        // Validate the presence of fileName
        if (!fileName) {
            return res.status(400).json({ error: 'File name is required' });
        }

        // Find the school record using the provided loginEmail
        const school = await School.findOne({ loginEmail });

        if (!school) {
            return res.status(404).json({ error: 'School not found' });
        }

        // Find the file to delete by its name
        const fileToDelete = school.feeStructure.find(
            (file) => file.fileName === fileName
        );

        if (!fileToDelete) {
            return res.status(404).json({ error: 'File not found in fee structure' });
        }

        // Delete the file from the filesystem
        await deletePdfFile(fileToDelete.fileName);

        // Remove the file from the school's fee structure
        school.feeStructure = school.feeStructure.filter(
            (file) => file.fileName !== fileName
        );

        // Save the updated school record
        const updatedSchool = await school.save();

        // Respond with a success message
        res.status(200).json({
            success: true,
            message: 'Fee structure file deleted successfully',
            school: updatedSchool,
        });
    } catch (error) {
        console.error('Error deleting fee structure file:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


//=======================Search School Controller====================================
const searchSchoolsController = async (req, res) => {
    try {
        const { name, affiliatedTo, district, pin, page = 1, limit = 10 } = req.body;
        let filter = {};

        if (name) filter.name = { $regex: name, $options: 'i' };
        if (district) filter["reachUs.address.district"] = { $regex: district, $options: 'i' };
        if (affiliatedTo) filter.affiliatedTo = { $regex: affiliatedTo, $options: 'i' };
        if (pin) filter["reachUs.address.pin"] = { $regex: pin, $options: 'i' };

        const schools = await School.find(filter).skip((page - 1) * limit).limit(parseInt(limit));
        const total = await School.countDocuments(filter);

        return res.status(200).json({
            message: schools.length ? 'Schools fetched successfully' : 'No schools found',
            schools,
            pagination: { total, page, limit },
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
const displaySchoolProfileDetailsController = async (req, res) => {
    try {
        const { loginEmail } = req.body; // Changed from req.query to req.body
        if (!loginEmail) {
            return res.status(400).send({
                success: false,
                message: 'Email is required to fetch profile details.',
            });
        }

        // Query the database for the user's profile
        const schoolProfile = await School.findOne({ loginEmail });

        if (!schoolProfile) {
            return res.status(404).send({
                success: false,
                message: 'No profile found for the provided email.',
            });
        }

        // Format and send the profile data
        const schoolProfileDetails = {
            email: schoolProfile.loginEmail,
            phone: schoolProfile.contactPersonPhone,
            userName: schoolProfile.contactPersonName,
            location: schoolProfile.reachUs
        };

        res.status(200).send({
            success: true,
            message: 'Profile details retrieved successfully.',
            data: schoolProfileDetails,
        });
    } catch (error) {
        console.error('Error in profile display:', error);
        res.status(500).send({
            success: false,
            message: 'Error in retrieving profile details.',
        });
    }
};

const updateFacilitiesInfoController = async (req, res) => {
    try {
        const { loginEmail, classes, staff, student } = req.body;

        // Basic validation
        if (!loginEmail || classes == null || staff == null || student == null) {
            return res.status(400).send({
                success: false,
                message: 'loginEmail, classes, staff, and student are required.',
            });
        }

        // Fetch school
        const school = await School.findOne({ loginEmail });

        if (!school) {
            return res.status(404).send({
                success: false,
                message: 'School not found with the given email.',
            });
        }

        // If one facilityInfo entry is allowed, overwrite it
        school.facilitiesInfo = [{
            classes: String(classes),
            staff: String(staff),
            student: String(student)
        }];

        await school.save();

        return res.status(200).send({
            success: true,
            message: 'Facilities information updated successfully.',
            data: school.facilitiesInfo
        });

    } catch (error) {
        console.error('Error updating facilities info:', error);
        return res.status(500).send({
            success: false,
            message: 'Server error while updating facilities info.'
        });
    }
};

// Create or update social links for a school
const updateSocialLinksController = async (req, res) => {
    try {
        const { loginEmail, facebook, x, instagram, linkedin, youtube, whatsapp } = req.body;

        // Basic validation - email is required
        if (!loginEmail) {
            return res.status(400).send({
                success: false,
                message: 'loginEmail is required.',
            });
        }

        // Fetch school
        const school = await School.findOne({ loginEmail });

        if (!school) {
            return res.status(404).send({
                success: false,
                message: 'School not found with the given email.',
            });
        }

        // Create or update social links object
        const socialLinks = {
            facebook: facebook || '',
            x: x || '',
            instagram: instagram || '',
            linkedin: linkedin || '',
            youtube: youtube || '',
            whatsapp: whatsapp || '',
        };

        // Update school's socialLinks field
        school.socialLinks = socialLinks;

        await school.save();

        return res.status(200).send({
            success: true,
            message: 'Social links updated successfully.',
            data: school.socialLinks
        });

    } catch (error) {
        console.error('Error updating social links:', error);
        return res.status(500).send({
            success: false,
            message: 'Server error while updating social links.'
        });
    }
};

// Get social links for a school
const getSocialLinksController = async (req, res) => {
    try {
        const { loginEmail } = req.query;
        console.log("loginEmail", loginEmail);
        // Better validation with specific error message
        if (!loginEmail || loginEmail.trim() === '') {
            return res.status(400).send({
                success: false,
                message: 'Valid loginEmail is required in query parameters.',
            });
        }

        // Log for debugging
        console.log(`Searching for school with email: ${loginEmail}`);

        // Fetch school with lean() for better performance
        const school = await School.findOne({ loginEmail }).lean();

        if (!school) {
            return res.status(404).send({
                success: false,
                message: `School not found with email: ${loginEmail}`,
            });
        }

        // Return social links with safe default
        const socialLinks = school.socialLinks || {
            facebook: '',
            x: '',
            instagram: '',
            linkedin: '',
            youtube: '',
            whatsapp: '',
        };

        return res.status(200).send({
            success: true,
            message: 'Social links retrieved successfully.',
            data: socialLinks
        });

    } catch (error) {
        console.error('Error retrieving social links:', error);

        // More specific error message
        const errorMessage = error.name === 'ValidationError'
            ? 'Data validation error'
            : 'Server error while retrieving social links';

        return res.status(500).send({
            success: false,
            message: errorMessage,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

const getSchoolViewers = async (req, res) => {
    try {
        const { loginEmail, page = 1, limit = 10 } = req.body;

        // Validate loginEmail
        if (!loginEmail) {
            return res.status(400).json({
                success: false,
                message: "Login email is required"
            });
        }

        // Find the school based on loginEmail
        const school = await School.findOne({ loginEmail });
        if (!school) {
            return res.status(404).json({
                success: false,
                message: "School not found with the provided email"
            });
        }

        const schoolId = school._id;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Fetch viewers with pagination
        const viewers = await SchoolViewLog.find({ schoolId })
            .sort({ lastViewedAt: -1 }) // Sort by most recent first
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count for pagination info
        const totalViewers = await SchoolViewLog.countDocuments({ schoolId });

        return res.status(200).json({
            success: true,
            message: "School viewers retrieved successfully",
            data: {
                viewers,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(totalViewers / parseInt(limit)),
                    totalViewers,
                    limit: parseInt(limit)
                }
            }
        });
    } catch (error) {
        console.error("Error in getSchoolViewers controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    sendRegisterOtpControllers, verifyRegistrationOtpControllers, getSchoolDetailsControllers, addSchoolDetailsControllers, sendSchoolLoginOtpControllers, verifySchoolLoginOtpControllers, updateCoverPictureController, deleteCoverPictureController, deleteProfilePictureController,
    updateProfilePictureController, updateGalleryPicturesController,
    deleteGalleryImageController, updateNameOfSchoolAndBoardController, addAboutUsController,
    addSuccessStoryController, updateSuccessStoryController, deleteSuccessStoryController, getSuccessStoriesController, fetchSchoolByIdController, fetchSchoolByIdControllerTwo, allSchoolsController, fetchSchoolsByBoardController,
    updateFacilityIntroduction, addOrUpdateFieldsInFacility, fetchFacilities, updateReachUsController, uploadFeeStructure, deleteFeeStructure, searchSchoolsController,
    displaySchoolProfileDetailsController, updateFacilitiesInfoController, updateSocialLinksController, getSocialLinksController, getSchoolViewers
};
