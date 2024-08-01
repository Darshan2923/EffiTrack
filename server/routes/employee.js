import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { createNewTask, deleteTask, getAllTasks, updateTask } from '../controllers/employee.js';

const router = express.Router();
router.post("/createTask", verifyToken, createNewTask);
router.get("/getalltasks", verifyToken, getAllTasks);
router.put("/updatetask", verifyToken, updateTask);
router.delete("/deletetask", verifyToken, deleteTask);

export default router;
