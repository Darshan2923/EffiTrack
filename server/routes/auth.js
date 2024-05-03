import express from 'express';
import { localVariables } from '../middleware/verifyEmail.js'
import { AdminLogin, AdminRegister, EmployeeLogin, UpdatePass, UpdateProfile, createResetSession, findUserByEmail, generateOTP, resetPassword, verifyOTP } from '../controllers/auth';

const router = express.Router();

router.post("/admin/register", localVariables, AdminRegister);
router.post("/admin/login", AdminLogin);
router.get("/admin/generateotp", localVariables, generateOTP);
router.get("/admin/verifyotp", verifyOTP);
router.get("/admin/createResetSession", createResetSession);
router.put("/admin/forgetpassword", resetPassword);
router.post("/employee/login", EmployeeLogin);
router.get("/admin/findbyemail", findUserByEmail);
router.put("/updatepassword", verifyToken, UpdatePass);
router.put("/updateprofile", verifyToken, UpdateProfile);

export default router;


