import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { EmployeeRegister, getAllEmployee, getEmployee } from '../controllers/admin.js'

const router = express.Router();

router.post("/employee-register", verifyToken, EmployeeRegister)
router.get("/getAllEmployees", verifyToken, getAllEmployee);
router.get("/getEmployee/:employeeId", verifyToken, getEmployee);

export default router;