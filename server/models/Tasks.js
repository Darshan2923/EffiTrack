import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
    task_description: { type: String, required: true },
    task_type: { type: String, required: true, default: "work" },
    start_time: { type: Date, required: true, default: Date.now() },
    time_taken: { type: Number, required: true, default: 0 },

}, { timestamps: true });

const taskModel = mongoose.model("Tasks", TaskSchema);

export default taskModel;