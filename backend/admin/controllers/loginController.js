const { sendVerificationEmail } = require("../helpers/sendMailHelper");
const adminModel = require('../../models/adminModel');
// controllers/loginController.js
controller_render_login = (req, res) => {
    res.render('pages/login');
}

controller_send_otp = async (req, res) => {
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
        console.log("Login Otp", otp);
        // Route to set a variable with an expiration time  
        const ttl = 300000;
        const loginExpiresTime = 7 * 24 * 60 * 60 * 1000;
        const otpExpires = Date.now() + parseInt(ttl);
        const emailExpires = Date.now() + parseInt(ttl);
        const loginExpires = Date.now() + parseInt(loginExpiresTime);

        if (!req.session.variables) {
            req.session.variables = {};
        }
        req.session.variables["generatedOtp"] = { value: otp, expires: otpExpires };
        req.session.variables["tempEmail"] = { value: email, expires: emailExpires };
        req.session.variables["isLoggedIn"] = { value: false, expires: loginExpires };
        // console.log(`Variable ${key} set with value ${value} and TTL ${ttl} ms`);

        res.status(200).send({
            success: true,
            message: 'OTP Successfully send to the email ID',
            Otp: otp,
        })

        //Send Otp to email 
        //  sendVerificationEmail(email, otp);

    } catch (error) {
        console.log(error);
        res.status(200).send({
            success: false,
            message: 'Error in send-login-otp API',
            error,
        });
    }

};

controller_verify_otp = async (req, res) => {
    try {
        const { enteredOtp } = req.body;
        const key = "generatedOtp";
        console.log("sesseion value", req.session.variables["isLoggedIn"].value);
        if (req.session.variables && req.session.variables[key]) {
            //console.log(`Variable ${key}: ${req.session.variables[key].value}`);
            // console.log(enteredOtp);
            //  console.log(req.session.variables[key].value);
            if (enteredOtp == req.session.variables[key].value) {
                // console.log('Otp verification successfull. Loged in Successfully');

                // Existing Email Check........   
                const email = req.session.variables['tempEmail'].value;
                const existingUser = await adminModel.findOne({ email });
                if (existingUser) {
                    const ttl = 7 * 24 * 60 * 60 * 1000;
                    const otpExpires = Date.now() + parseInt(ttl);
                    const emailExpires = Date.now() + parseInt(ttl);
                    req.session.variables["isLoggedIn"] = { value: true, expires: otpExpires };
                    req.session.variables["email"] = { value: email, expires: emailExpires };
                    return res.status(200).send({
                        success: true,
                        message: 'Login successfull',
                    });
                }

                const data = await new adminModel({ email }).save();
                const ttl = 7 * 24 * 60 * 60 * 1000;
                const otpExpires = Date.now() + parseInt(ttl);
                const emailExpires = Date.now() + parseInt(ttl);
                req.session.variables["isLoggedIn"] = { value: true, expires: otpExpires };
                req.session.variables["email"] = { value: email, expires: emailExpires };
                return res.status(200).send({
                    success: true,
                    message: 'Login successfull',
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

const controller_logout = (req, res) => {
    try {
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send({
                    success: false,
                    message: 'Failed to log out',
                    error: err,
                });
            }
            res.redirect('/admin');
            // res.send({
            //     success: true,
            //     message: 'Logged out successfully',
            // });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in logging out',
            error,
        });
    }
};


module.exports = { controller_render_login, controller_send_otp, controller_verify_otp, controller_logout }