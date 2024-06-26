import axios from 'axios';

const API = axios.create({
    baseURL: "http://localhost:5000/api/"
})

const generateOtp = async (email, name, email) => {
    await API.get(
        `/auth/admin/generateotp?email=${email}&name=${name}&reason=${reason}`
    )
}

export const verifyOtp = async (otp) =>
    await API.get(`/auth/admin/verifyotp?code=${otp}`);

export const updatePassword = async (data, token) =>
    await API.put("/auth/updatepassword", data, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const getAllEmployees = async (token) => {
    await API.get("/admin/getAllEmployees", {
        headers: { Authorization: `Bearer ${token}` }
    })
}
export const getAllTasks = async (token) => {
    await API.get("/employee/getalltasks", {
        headers: { Authorization: `Bearer ${token}` }
    })
}

// Employee routes
export const createNewTask = async (data, token) =>
    await API.post("/employee/createtask", data, {
        headers: { Authorization: `Bearer ${token}` }
    });

export const updateTask = async (data, token) => {
    await API.put("/employee/updatetask", data, {
        headers: { Authorization: `Bearer ${token}` }
    })
}

export const deleteTask = async (id, token) =>
    await API.delete(`/employee/deletetask?taskId=${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })
