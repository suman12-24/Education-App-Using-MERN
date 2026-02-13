const { sendVerificationEmail } = require('../helpers/SendMailHelpers');
const guardianEnquiryFormModel = require('../models/guardianEnquiryFormModel');
const userModel = require('../models/userModel');
const schoolDetailsModel = require('../models/schoolDetailsModel');
const JWT = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');


//Login Otp send Controller
const sendLoginOtpControllers = async (req, res) => {
    try {
        const { email, role } = req.body;
        if (!email) {
            return res.send({
                success: false,
                message: 'Email field cannot be left empty',
            })
        }

        if (!role) {
            return res.send({
                success: false,
                message: 'Role field cannot be left empty',
            })
        }
        if (role == 'Guardian') {
            const existingUser = await userModel.findOne({ email });
            if (!existingUser) {
                res.status(200).send({
                    otpStatus: false,
                    loginEmail: email,
                    message: 'User not registered Signup now',
                })
                return;
            }
        }
        if (role == 'School') {
            const existingUser = await schoolDetailsModel.findOne({ email });
            if (!existingUser) {
                res.status(200).send({
                    otpStatus: false,
                    loginEmail: email,
                    message: 'School not registered Signup now',
                })
                return;
            }
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
        sendVerificationEmail(email, otp);

    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            message: 'Error in send-login-otp API',
            error,
        });
    }
}

// Controller to fetch addresses by pincode
const fetchAddressByPincode = (req, res) => {
    const { pincode } = req.body; // Extract pincode from request parameters
    console.log(typeof (pincode));

    // Path to the JSON file
    const filePath = path.join(__dirname, '../pincodeAddress.json');

    // Read the JSON file
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading the file' });
        }

        try {
            // Parse the JSON data
            const addresses = JSON.parse(data);

            // Filter addresses by pincode
            const filteredAddresses = addresses.filter(
                address => address.Pincode === parseInt(pincode, 10)
            );

            // Return the filtered addresses
            if (filteredAddresses.length > 0) {
                res.json({ success: true, filteredAddresses });
            } else {
                res.json({ success: false, message: 'No address found for the given pincode' });
            }
        } catch (parseError) {
            res.status(500).json({ error: 'Error parsing JSON data' });
        }
    });
};


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
        sendVerificationEmail(email, otp);

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

                // Validate retrieved data
                if (!email || !phone || !userName || !location) {
                    return res.status(400).send({
                        success: false,
                        message: 'Session data is incomplete or invalid',
                    });
                }

                // Check if the user already exists
                const existingUser = await userModel.findOne({ email });
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

                // Create a new user
                const newUser = await new userModel({
                    email,
                    phone,
                    location,
                    name: userName,
                }).save();

                if (!newUser) {
                    return res.status(500).send({
                        success: false,
                        message: 'Error saving user data',
                    });
                }

                // Generate a JWT token for the new user
                const JWT_SECRET = process.env.JWT_SECRET;
                const token = await JWT.sign(
                    { _id: newUser._id },
                    JWT_SECRET,
                    { expiresIn: '7d' }
                );

                return res.status(201).send({
                    success: true,
                    message: 'User registered successfully, token generated',
                    token,
                });
            } else {
                // Invalid OTP entered
                return res.status(400).send({
                    success: false,
                    message: 'Invalid OTP entered',
                });
            }
        } else {
            // OTP does not exist or has expired
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

//Login Otp verify Controller
const verifyLoginOtpControllers = async (req, res) => {
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
                const email = req.session.variables['email'].value;
                const existingUser = await userModel.findOne({ email });
                if (existingUser) {

                    const JWT_SECRET = process.env.JWT_SECRET;
                    console.log('JWT_Secret', JWT_SECRET);
                    const token = await JWT.sign({ _id: existingUser._id }, JWT_SECRET, { expiresIn: '7d' });
                    return res.status(200).send({
                        success: true,
                        message: 'Carrying Token',
                        token: token,
                        userData: existingUser,
                    });
                }

                const data = await new userModel({ email }).save();
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

const addUserDetailsControllers = async (req, res) => {
    try {
        const { name, email, phone, location } = req.body;
        //validations
        if (!name) {
            return res.send({ message: 'Name is Required' });
        }

        if (!email) {
            return res.send({ message: 'Email is Required' });
        }

        if (!phone) {
            return res.send({ message: 'Phone is Required' });
        }

        if (!location) {
            return res.send({ message: 'Location is Required' });
        }
        //check user
        const existingUser = await userModel.findOne({ email });
        //existing user
        if (existingUser) {
            return res.status(200).send({
                sucess: false,
                message: 'User already registered.',

            })
        }

        //save
        const user = await new userModel({ name, email, phone, location }).save();
        res.status(201).send({
            success: true,
            message: 'User Added successfully',
            user,

        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in registration.',
            error: error
        })
    }
}

// Display Profile Details Controller
const displayProfileDetailsController = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).send({
                success: false,
                message: 'Email is required to fetch profile details.',
            });
        }

        // Query the database for the user's profile
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'No profile found for the provided email.',
            });
        }

        // Format and send the profile data
        const profileDetails = {
            email: user.email,
            phone: user.phone,
            userName: user.name,
            location: user.location,
            role: user.role,
        };

        res.status(200).send({
            success: true,
            message: 'Profile details retrieved successfully.',
            profile: profileDetails,
        });
    } catch (error) {
        console.error('Error in profile display:', error);
        res.status(500).send({
            success: false,
            message: 'Error in retrieving profile details.',
        });
    }
};

// Add new enquiry form

const guardianEnquiryFormControllers = async (req, res) => {
    try {
        const formData = req.body;

        // Create and save the enquiry form
        const enquiryForm = new guardianEnquiryFormModel(formData);
        await enquiryForm.save();

        // Push the enquiryForm ID and school_id as an object into the enquiries array
        await userModel.findOneAndUpdate(
            { email: formData.guardianLoginEmail }, // Find user by email
            {
                $push: {
                    enquiries: { enquiryFormId: enquiryForm._id, school_id: formData.school_id }
                }
            },
            { new: true, upsert: true } // Return updated document, create new if not found
        );

        res.status(201).json({ success: true, message: "Enquiry form submitted successfully!", enquiryFormId: enquiryForm._id });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error submitting enquiry form", error: error.message });
    }
};

// Update existing enquiry form
const updateEnquiryForm = async (req, res) => {
    try {
        const { id } = req.params; // Get form ID from URL
        const updateData = req.body; // Fields to update

        // Find the existing enquiry form
        const existingForm = await guardianEnquiryFormModel.findById(id);
        if (!existingForm) {
            return res.status(404).json({ message: "Enquiry form not found!" });
        }

        // Deep merge function for nested objects
        const deepMerge = (target, source) => {
            for (const key in source) {
                if (
                    source[key] &&
                    typeof source[key] === "object" &&
                    !Array.isArray(source[key])
                ) {
                    if (!target[key]) target[key] = {};
                    deepMerge(target[key], source[key]);
                } else {
                    target[key] = source[key]; // Update primitive values
                }
            }
        };

        // Merge the existing form with the update data
        const mergedData = existingForm.toObject(); // Convert Mongoose doc to plain object
        deepMerge(mergedData, updateData);

        // Update the document
        const updatedForm = await guardianEnquiryFormModel.findByIdAndUpdate(
            id,
            { $set: mergedData },
            { new: true, runValidators: true }
        );

        res.status(200).json({ success: true, message: "Enquiry form updated successfully!", updatedForm });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating enquiry form", error: error.message });
    }
};

// Fetch enquiry details based on guardianLoginEmail and school_id
const getEnquiryDetailsController = async (req, res) => {
    try {
        const { guardianLoginEmail, school_id } = req.body;

        if (!guardianLoginEmail || !school_id) {
            return res.status(400).json({
                success: false,
                message: "guardianLoginEmail and school_id are required",
            });
        }

        const enquiry = await guardianEnquiryFormModel.findOne({ guardianLoginEmail, school_id });

        if (!enquiry) {
            return res.status(200).json({
                success: false,
                message: "No enquiry found for the given details",
            });
        }

        res.status(200).json({
            success: true,
            message: "Enquiry details fetched successfully",
            enquiryDetails: enquiry,
        });
    } catch (error) {
        console.error("Error fetching enquiry details:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};


// Fetch the earliest enquiry details for a given guardianLoginEmail
const getEarliestEnquiryByGuardian = async (req, res) => {
    try {
        const { guardianLoginEmail } = req.query;

        if (!guardianLoginEmail) {
            return res.status(400).json({
                success: false,
                message: "guardianLoginEmail is required",
            });
        }

        const enquiry = await guardianEnquiryFormModel.findOne({ guardianLoginEmail })
            .sort({ createdAt: 1 }) // Ascending order to get the earliest document
            .exec();

        if (!enquiry) {
            return res.status(200).json({
                success: false,
                message: "No enquiry found for this guardian",
            });
        }

        return res.status(200).json({
            success: true,
            enquiryDetails: enquiry,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
};

//Geting Form Id by School id
const getEnquiryFormIds = async (req, res) => {
    try {
        const { email, school_id } = req.query;

        if (!email || !school_id) {
            return res.status(400).json({ message: "Email and school_id are required" });
        }

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const matchingEnquiries = user.enquiries
            .filter(enquiry => enquiry.school_id === school_id)
            .map(enquiry => enquiry.enquiryFormId);

        if (matchingEnquiries.length === 0) {
            return res.status(200).json({ success: false, message: "No enquiry form id found" });
        }

        res.status(200).json({ success: true, enquiryFormIds: matchingEnquiries });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


//========================= Add and Remove to  Fafourite Controller================
const addFavouriteSchoolController = async (req, res) => {
    try {
        const { schoolId, loginEmail } = req.body;

        // Validations
        if (!schoolId) {
            return res.status(400).send({ message: 'School ID is required' });
        }

        if (!loginEmail) {
            return res.status(400).send({ message: 'Login Email is required' });
        }

        // Check if the school exists
        const school = await schoolDetailsModel.findById(schoolId);
        if (!school) {
            return res.status(404).send({ message: 'School not found' });
        }

        // Check if the user exists
        const user = await userModel.findOne({ email: loginEmail });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Check if school is already in user's favourites
        if (user.favouriteSchools.includes(schoolId)) {
            return res.status(200).send({
                success: false,
                message: 'School already marked as favourite.',
            });
        }

        // Add school to user's favourites
        user.favouriteSchools.push(schoolId);
        await user.save();

        res.status(201).send({
            success: true,
            message: 'School added to favourites successfully',
            favouriteSchools: user.favouriteSchools,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error adding favourite school',
            error: error.message,
        });
    }
};

const removeFavouriteSchoolController = async (req, res) => {
    try {
        const { schoolId, loginEmail } = req.body;

        // Validations
        if (!schoolId) {
            return res.status(400).send({ message: 'School ID is required' });
        }

        if (!loginEmail) {
            return res.status(400).send({ message: 'Login Email is required' });
        }

        // Check if the school exists
        const school = await schoolDetailsModel.findById(schoolId);
        if (!school) {
            return res.status(404).send({ message: 'School not found' });
        }

        // Check if the user exists
        const user = await userModel.findOne({ email: loginEmail });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Check if school is in user's favourites
        if (!user.favouriteSchools.includes(schoolId)) {
            return res.status(200).send({
                success: false,
                message: 'School not in favourites.',
            });
        }

        // Remove school from user's favourites
        user.favouriteSchools = user.favouriteSchools.filter(id => id.toString() !== schoolId.toString());
        await user.save();

        res.status(200).send({
            success: true,
            message: 'School removed from favourites successfully',
            favouriteSchools: user.favouriteSchools,
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Error removing favourite school',
            error: error.message,
        });
    }
};

// controller to update favourtite schools
const updateFavouriteSchoolsController = async (req, res) => {
    const { email, favouriteSchools } = req.body;

    if (!email || !Array.isArray(favouriteSchools)) {
        return res.status(400).json({ message: "Email and favouriteSchools array are required" });
    }

    try {
        // Find user by email and update the favouriteSchools array
        const updatedUser = await userModel.findOneAndUpdate(
            { email }, // find by email
            { $set: { favouriteSchools } }, // update the favouriteSchools
            { new: true, upsert: true } // `new` returns the modified document, `upsert` creates a new one if it doesn't exist
        );
        // return user; // Returns the updated or created user

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the updated user data
        return res.status(200).json({ success: true, updatedUser });
    } catch (error) {
        console.error("Error updating favouriteSchools:", error);
        return res.status(500).json({ message: "Server error" });
    }
};


// Controller to fetch schools by an array of school IDs
const getFavouriteSchoolsByIds = async (req, res) => {
    try {
        const { schoolIds } = req.body; // Expecting an array of school IDs in request body

        if (!Array.isArray(schoolIds) || schoolIds.length === 0) {
            return res.status(400).json({ message: 'Invalid or empty schoolIds array' });
        }

        const schools = await schoolDetailsModel.find({ _id: { $in: schoolIds } });

        if (schools.length === 0) {
            return res.status(404).json({ message: 'No schools found' });
        }

        res.status(200).json(schools);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const getMostSearchedSchools = async (req, res) => {
    try {
        const { limit = 10 } = req.query; // Default to returning top 10 schools

        // Convert limit to number and validate
        const limitNum = parseInt(limit);
        if (isNaN(limitNum) || limitNum <= 0) {
            return res.status(400).json({ message: 'Invalid limit parameter' });
        }

        // Assuming you have a model that tracks search counts
        // This could be either a separate collection or an attribute in the schoolDetailsModel
        const schools = await schoolDetailsModel.find({})
            .sort({ searchCount: -1 }) // Sort by search count in descending order
            .limit(limitNum);

        if (schools.length === 0) {
            return res.status(404).json({ message: 'No schools found' });
        }

        res.status(200).json({
            success: true,
            message: 'Most searched schools fetched successfully',
            schools: schools
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }


};

const getMostViewedSchools = async (req, res) => {
    try {
        const { limit = 10 } = req.query; // Default to returning top 10 schools

        // Convert limit to number and validate
        const limitNum = parseInt(limit);
        if (isNaN(limitNum) || limitNum <= 0) {
            return res.status(400).json({ message: 'Invalid limit parameter' });
        }

        // Query for schools sorted by viewCount instead of searchCount
        const schools = await schoolDetailsModel.find({})
            .sort({ viewCount: -1 }) // Sort by view count in descending order
            .limit(limitNum);

        if (schools.length === 0) {
            return res.status(404).json({ message: 'No schools found' });
        }

        res.status(200).json({
            success: true,
            message: 'Most viewed schools fetched successfully',
            schools: schools
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }

};

module.exports = {
    addUserDetailsControllers, verifyLoginOtpControllers,
    sendLoginOtpControllers, guardianEnquiryFormControllers, fetchAddressByPincode,
    sendRegisterOtpControllers, verifyRegistrationOtpControllers, displayProfileDetailsController,
    updateEnquiryForm, getEnquiryFormIds, getEnquiryDetailsController, getEarliestEnquiryByGuardian, addFavouriteSchoolController,
    removeFavouriteSchoolController, getFavouriteSchoolsByIds, updateFavouriteSchoolsController
    , getMostSearchedSchools, getMostViewedSchools
}