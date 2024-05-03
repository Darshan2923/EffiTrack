import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import adminRoutes from './routes/admin.js';
import employeeRoutes from './routes/employee.js';

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

// app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);

const connect = () => {
    console.log("He rupali");
    // mongoose.set("strictQuery", true);
    // mongoose.connect(process.env.MONGO_URI)
    // .then(()=>console.log("Mongodb connected"))
    // .catch((err)=>console.error(err))
}

app.listen(port, () => { console.log("Server running successfully"); connect() });