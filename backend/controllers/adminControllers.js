const { sendVerificationEmail } = require('../helpers/SendMailHelpers');
const adminModel = require('../models/adminModel');
const JWT = require('jsonwebtoken');

//Login Otp send Controller
const sendAdminLoginOtpControllers = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.send({
                success: false,
                message: 'Email field cannot be left empty',
            })
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


//Login Otp verify Controller
const verifyAdminLoginOtpControllers = async (req, res) => {
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
                const existingUser = await adminModel.findOne({ email });
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

                const data = await new adminModel({ email }).save();
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

module.exports = { sendAdminLoginOtpControllers, verifyAdminLoginOtpControllers }
