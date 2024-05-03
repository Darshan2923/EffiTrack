import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: "admin"
    },
    active: {
        type: Boolean,
        default: true
    },
    contact_number: {
        type: String,
        default: null
    },
    department: {
        type: String,
        default: null
    },
    joining_date: {
        type: Date,
        default: null
    },
    employees: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    tasks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Tasks",
        default: []
    }
},
    { timestamps: true }
);

const userModel = mongoose.model("User", UserSchema);

export default userModel;