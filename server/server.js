import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import adminRoutes from './routes/admin.js';
import employeeRoutes from './routes/employee.js';
import authRoutes from './routes/auth.js'

const app = express();
dotenv.config();
app.use(express.json());
const corsConfig = {
    credentials: true,
    origin: true,
}
app.use(cors(corsConfig));
app.use(morgan("tiny"));
const port = process.env.PORT || 8800;
console.log(port)

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || "Something went wrong";
    res.status(status).json({
        status,
        message,
    });
});


const connect = () => {
    // console.log("Mongo URI:", process.env.MONGO_URI);
    mongoose.connect(process.env.MONGO_URI)
        .then(() => console.log("MongoDB connected"))
        .catch((err) => console.error("MongoDB connection error:", err));

}

app.listen(port, () => { console.log("Server running successfully"); connect() });