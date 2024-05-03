import dotenv from "dotenv";
import bcrypt from 'bcrypt';
import userModel from "../models/User.js";
import { createError } from "../error.js";


dotenv.config();

export const EmployeeRegister = async (req, res, next) => {
    try {
        const { email, password, username, contact_number, department, joining_date } = req.body;
        const { id } = req.user;

        // check we have an email
        if (!email) {
            return next(createError(422, "Missing email."));
        }
        // check if email is in use
        const existingUser = await userModel.findOne({ email }).exec();
        if (existingUser) {
            return next(createError(409, "Email already in use"));
        }
        const admin = await userModel.findById(id).exec();

        if (!admin) {
            return next(createError(404, "Admin not found"));
        }

        if (admin.role !== "admin") {
            return next(createError(403, "You are not an admin"));
        }

        const salt = bcrypt.genSaltSync(10);
        const hashedpass = bcrypt.hashSync(password, salt);

        const user = new userModel({
            username, email, password: hashedpass, role: "employee", contact_number, department, joining_date
        });

        const createdUser = await user.save();

        admin.employees.push(createdUser._id);
        await admin.save();
        res.status(200).json({ employee: createdUser });

    } catch (error) {
        console.error(error)
        next(error);
    }
}

export const getAllEmployee = async (req, res, next) => {
    try {
        const { id } = req.user;

        // check if user exists and is a employee
        const user = await userModel.findById(id).populate({
            path: "employees",
            select: "-password"
        });
        if (!user) {
            return next(createError(404, "User not found"));
        }

        if (user.role !== "admin") {
            return next(createError(401, "You are not authorized to view this page"));
        }
        return res.status(200).json({
            message: "Employees fetched successfully",
            employees: user.employees
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

export const getEmployee = async (req, res, next) => {
    try {
        const { id } = req.user;
        const { employeeId } = req.params;

        // check if user exists and is admin;
        const user = await userModel.findById(id);
        if (!user) {
            return next(createError(404, "User not found"));
        }
        if (user.role !== "admin") {
            return next(createError(401, "You are not an admin"));
        }

        const employee = await userModel.findById(employeeId)
            .select("-password")
            .populate("tasks")
            .exec()

        if (!employee) {
            return next(createError(404, "Employee not found"));
        }
        return res.status(200).json({
            message: "Employee fetched successfully",
            employee
        });

    } catch (error) {
        console.error(error);
        next(error)
    }
}
