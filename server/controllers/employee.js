import dotenv from 'dotenv';
import userModel from '../models/User.js';
import taskModel from '../models/Tasks.js';

dotenv.config();

export const createNewTask = async (req, res, next) => {
    try {
        // check if user exists
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return next(createError(404, "User not found"));
        }
        const newTask = new Task(req.body);
        const savedTask = await newTask.save();
        // add task id to the user's tasks array
        user.tasks.push(savedTask._id);
        const savedUser = await user.save();
        return res.status(200).json({
            message: "Task created successfully",
            user: savedUser
        });
    } catch (error) {
        console.error(error);
        return next(createError(err.statusCode, err.message));
    }
}

export const updateTask = async (req, res, next) => {
    try {
        // check if user exists
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return next(createError(404, "User not found"));
        }
        // check if task exist to the user
        if (!user.tasks.includes(req.body._id)) {
            return next(createError(404, "You cannot update"));
        }

        // update the task
        const task = await taskModel.findByIdAndUpdate(req.body._id, req.body, {
            new: true
        }).exec();

        return res.status(200).json({
            message: "Task updated successfully",
            task
        });

    } catch (error) {
        return next(createError(err.statusCode, err.message))
    }
}

export const deleteTask = async (req, res, next) => {
    try {
        const { taskId } = req.query;
        // check if user exists
        const user = await userModel.findById(req.user.id);
        if (!user) {
            return next(createError(404, "User not found"));
        }

        // check if task exisit to that user
        if (!user.tasks.includes(taskId)) {
            return next(createError(404, "You can't delete"));
        }

        user.tasks.pop(taskId);
        await user.save();

        // delete the task
        await Task.findByIdAndDelete(req.body._id).exec();

        return res.status(200).json({
            message: "Task deleted successfully"
        });
    } catch (err) {
        return next(createError(err.statusCode, err.message));
    }
};

export const getAllTasks = async (req, res, next) => {
    try {
        const { id } = req.user;

        // check if user exists and is a employee
        const user = await userModel.findById(id).populate("tasks");
        if (!user) {
            return next(createError(404, "User not found"));
        }

        if (user.role !== "employee") {
            return next(createError(401, "You are not authorized to view this page"));
        }

        return res.status(200).json({
            message: "Tasks fetched successfully",
            tasks: user.tasks
        });
    } catch (err) {
        return next(createError(err.statusCode, err.message));
    }
};





