import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import otpGenerator from 'otp-generator';
import { createError } from '../error.js';
import userModel from '../models/User.js';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    },
    secure: true,
    port: parseInt(465),
    host: "smtp.gmail.com"
});

export const AdminRegister = async (req, res, next) => {
    try {
        const { email, password, username } = req.body;
        // Check if the email 
        if (!email) {
            return next(createError(422, "Missing email field"));
        }

        // Check if the email is in use
        const existingUser = await userModel.findOne({ email }).exec();
        if (existingUser) {
            return next(createError(409, "Email is already in use."));
        }
        const salt = bcrypt.genSaltSync(10);
        const hashedPass = bcrypt.hashSync(password, salt);
        const user = new userModel({
            username, email, password: hashedPass, role: "admin", img: req.body.img || 'default_image_url' // Provide a default value for the img field
        });
        const createdUser = await user.save();
        const token = jwt.sign({ id: createdUser._id }, process.env.JWT, {
            expiresIn: "7 days"
        });
        return res.status(200).json({ token, user });

    } catch (error) {
        console.error(error);
        return next(createError(422, error.message));
    }
}

export const AdminLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check we have an email
        if (!email || !password) {
            return next(createError(422, "Missing email or password"));
        }
        const user = await userModel.findOne({ email: req.body.email });
        // Check if user exists
        if (!user) {
            return next(createError(404, "User not found"));
        }
        // check if user is admin
        if (user.role !== "admin") {
            return next(
                createError(403, "You are not an admin login as an employee")
            );
        }

        //   Check if password is correct
        const isPassCorrect = await bcrypt.compareSync(password, user.password)
        if (!isPassCorrect) {
            return next(createError(403, "Incorrect password"));
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT, {
            expiresIn: "7 days"
        });

        const adminUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            active: user.active,
            img: user.img,
            employees: user.employees
        };
        return res.status(200).json({ token, user: adminUser });
    } catch (error) {
        console.error(error)
        return next(createError(err.statusCode, err.message));
    }
}

export const EmployeeLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check we have an email
        if (!email) {
            return next(createError(422, "Missing email."));
        }

        // Check we have a password
        if (!password) {
            return next(createError(422, "Missing password."));
        }

        const user = await userModel.findOne({ email: req.body.email });
        // Check if user exists
        if (!user) {
            return next(createError(404, "User not found"));
        }

        // check if user is admin
        if (user.role !== "employee") {
            return next(
                createError(403, "You are not an employee login as an admin")
            );
        }

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compareSync(password, user.password);
        if (!isPasswordCorrect) {
            return next(createError(403, "Incorrect password"));
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT, {
            expiresIn: "9999 years"
        });

        const employeeUser = {
            _id: user._id,
            username: user.username,
            email: user.email,
            active: user.active,
            role: user.role,
            img: user.img,
            contact_number: user.contact_number,
            department: user.department,
            joining_date: user.joining_date,
            tasks: user.tasks
        };

        return res.status(200).json({ token, user: employeeUser });
    } catch (error) {
        return next(error);
    }
};

export const UpdatePass = async (req, res, next) => {
    try {
        const { oldPassword, password } = req.body;
        const { id } = req.user;
        // check we have on old password
        if (!oldPassword || !password) {
            return next(createError(422, "Missing password."));
        }

        const user = await userModel.findById(id);

        //   Check if password is correct
        const isPassCorrect = await bcrypt.compareSync(oldPassword, user.password);
        if (!isPassCorrect) {
            return next(createError(403, "Incorrect password"));
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);
        user.password = hashedPassword;
        await user.save();
        return res.status(200).send({ message: "OTP sent" });
    } catch (error) {
        return next(error);
    }
}

export const UpdateProfile = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await userModel.findByIdAndUpdate(id, req.body, {
            new: true
        }).exec();
        return res.status(200).json({ user });

    } catch (error) {
        return next(error);
    }
}

export const generateOTP = async (req, res, next) => {
    req.app.locals.OTP = await otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
        digits: true
    });
    const { email } = req.query;
    const { name } = req.query;
    const { reason } = req.query;
    const verifyOtp = {
        to: email,
        subject: "Account Verification OTP",
        html: `
          <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
      <h1 style="font-size: 22px; font-weight: 500; color: #854CE6; text-align: center; margin-bottom: 30px;">Verify Your Account</h1>
      <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
          <div style="background-color: #854CE6; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
              <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
              <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${req.app.locals.OTP}</h1>
          </div>
          <div style="padding: 30px;">
              <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear ${name},</p>
              <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Thank you for creating a account. To activate your account, please enter the following verification code:</p>
              <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #854CE6;">${req.app.locals.OTP}</p>
              <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the  app to activate your account.</p>
              <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not create a account, please disregard this email.</p>
          </div>
      </div>
      <br>
      <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The Team</p>
  </div>
          `
    };

    const resetPasswordOtp = {
        to: email,
        subject: "Reset Password Verification",
        html: `
              <div style="font-family: Poppins, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
                  <h1 style="font-size: 22px; font-weight: 500; color: #854CE6; text-align: center; margin-bottom: 30px;">Reset Your  Account Password</h1>
                  <div style="background-color: #FFF; border: 1px solid #e5e5e5; border-radius: 5px; box-shadow: 0px 3px 6px rgba(0,0,0,0.05);">
                      <div style="background-color: #854CE6; border-top-left-radius: 5px; border-top-right-radius: 5px; padding: 20px 0;">
                          <h2 style="font-size: 28px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 10px;">Verification Code</h2>
                          <h1 style="font-size: 32px; font-weight: 500; color: #FFF; text-align: center; margin-bottom: 20px;">${req.app.locals.OTP}</h1>
                      </div>
                      <div style="padding: 30px;">
                          <p style="font-size: 14px; color: #666; margin-bottom: 20px;">Dear ${name},</p>
                          <p style="font-size: 14px; color: #666; margin-bottom: 20px;">To reset your account password, please enter the following verification code:</p>
                          <p style="font-size: 20px; font-weight: 500; color: #666; text-align: center; margin-bottom: 30px; color: #854CE6;">${req.app.locals.OTP}</p>
                          <p style="font-size: 12px; color: #666; margin-bottom: 20px;">Please enter this code in the app to reset your password.</p>
                          <p style="font-size: 12px; color: #666; margin-bottom: 20px;">If you did not request a password reset, please disregard this email.</p>
                      </div>
                  </div>
                  <br>
                  <p style="font-size: 16px; color: #666; margin-bottom: 20px; text-align: center;">Best regards,<br>The Team</p>
              </div>
          `
    }
    if (reason === "FORGOTPASSWORD") {
        transporter.sendMail(resetPasswordOtp, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(200).send({ message: "OTP sent" });
        });
    } else {
        transporter.sendMail(verifyOtp, (err) => {
            if (err) {
                return next(err);
            }
            return res.status(200).send({ message: "OTP sent" });
        });
    }
};

export const verifyOTP = async (req, res, next) => {
    const { code } = req.query;
    // eslint-disable-next-line radix
    if (parseInt(code) === parseInt(req.app.locals.OTP)) {
        req.app.locals.OTP = null;
        req.app.locals.resetSession = true;
        return res.status(200).send({ message: "OTP verified" });
    }
    return next(createError(403, "Wrong OTP"));
};


export const createResetSession = async (req, res) => {
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false;
        return res.status(200).send({ message: "Access granted" });
    }

    return res.status(400).send({ message: "Session expired" });
};

export const resetPassword = async (req, res, next) => {
    if (!req.app.locals.resetSession) {
        return res.status(440).send({ message: "Session expired" });
    }

    const { email, password } = req.body;
    try {
        await userModel.findOne({ email }).then((user) => {
            if (user) {
                if (user.role !== "admin") {
                    return next(
                        createError(403, "You are not an admin login as an admin")
                    );
                }
                const salt = bcrypt.genSaltSync(10);
                const hashedPassword = bcrypt.hashSync(password, salt);
                userModel.updateOne({ email }, { $set: { password: hashedPassword } })
                    .then(() => {
                        req.app.locals.resetSession = false;
                        return res.status(200).send({
                            message: "Password reset successful"
                        });
                    })
                    .catch((err) => {
                        next(err);
                    });
            }
            return res.status(202).send({
                message: "User not found"
            });
        });
        return res.status(202).send({
            message: "User not found"
        });
    } catch (err) {
        return next(err);
    }
};

export const findUserByEmail = async (req, res, next) => {
    const { email } = req.query;
    console.log(`Searching for user with email: ${email}`);

    try {
        const user = await userModel.findOne({ email });
        console.log(`User found: ${user}`);

        if (!user) {
            console.log('User does not exist');
            return res.status(404).json({ message: "User does not exist" });
        }

        // Handle different roles if needed
        if (user.role === "admin") {
            return res.status(200).json({ message: "User found" });
        } else if (user.role === "employee") {
            return next(createError(403, "You are an employee, login as an employee"));
        }
    } catch (err) {
        console.error('Error in findUserByEmail:', err);
        return next(err);
    }
};


