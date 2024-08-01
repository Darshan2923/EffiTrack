import axios from 'axios';

const API = axios.create({
    baseURL: "http://localhost:5000/api"
});

// Signup
export const AdminRegister = async (data) => {
    await API.post("/auth/admin/register", data);
}

export const findUserByEmail = async (email) => {
    await API.get(`/auth/admin/findbyemail?email=${email}`);
}

// OTP
export const generateOtp = async (email, name, reason) =>
    await API.get(
        `/auth/admin/generateotp?email=${email}&name=${name}&reason=${reason}`
    );
export const verifyOtp = async (otp) =>
    await API.get(`/auth/admin/verifyotp?code=${otp}`);



// SignIn
export const AdminLogin = async (data) =>
    await API.post("/auth/admin/login", data);

export const EmployeeLogin = async (data) =>
    await API.post("/auth/employee/login", data);

// Forget Password
export const resetPassword = async (email, password) =>
    await API.put("/auth/admin/forgetpassword", { email, password });





