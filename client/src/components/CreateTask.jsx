import React, { useEffect } from 'react'
import { createNewTask } from '../api/apiList'
import { toast, ToastContainer } from 'react-toastify';

const CreateTask = ({ setOpenCreateTask }) => {
    // Hooks
    const token = localStorage.getItem("effitrack-token");
    const [loading, setLoading] = React.useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState({ apierror: "" });
    const [formData, setFormData] = React.useState({
        task_description: "",
        task_type: "",
        start_time: "",
        time_taken: ""
    });

    //   Functions
    // Sets the input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        // If there is no error message and all the fields are filled, then enable the button
        if (
            formData.task_description && formData.task_type && formData.start_time && formData.time_taken
        ) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [formData]);

    // Submits the form data
    const handleSubmit = (e) => {
        e.preventDefault();

        // If there is no error message, then submit the form
        if (!buttonDisabled) {
            setLoading(true);
            setButtonDisabled(true);
            createNewTask(formData, token)
                .then((res) => {
                    if (res.status === 200) {
                        toast.success("Successfully created the task!");
                        setLoading(false);
                        setButtonDisabled(false);
                        setErrorMessage({
                            ...errorMessage,
                            apierror: ""
                        });
                        setOpenCreateTask(false);
                    }
                }).catch((err) => {
                    setButtonDisabled(false);
                    setErrorMessage({
                        ...errorMessage,
                        apierror: err.response.data.message
                    });
                })
        } else {
            setLoading(false);
            toast.error("An error occured");
        }
    }


    return (
        <div className="relative flex flex-col gap-4 p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-medium text-gray-800">Create New Task</h1>
            <CloseRounded
                className="absolute text-2xl cursor-pointer top-4 right-6"
                onClick={() => setOpenCreateTask(false)}
            />
            <form className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center w-full p-3 border rounded-md border-gray-300 focus-within:border-blue-500">
                        <BusinessRounded />
                        <select
                            className="w-full ml-3 text-sm bg-transparent border-none outline-none text-gray-700"
                            name="task_type"
                            value={formData.task_type}
                            onChange={handleInputChange}
                        >
                            <option value="" disabled hidden>Task Type</option>
                            <option value="break">Break</option>
                            <option value="meeting">Meeting</option>
                            <option value="work">Work</option>
                        </select>
                    </div>
                    <div className="flex items-center w-full p-3 border rounded-md border-gray-300 focus-within:border-blue-500">
                        <DateRangeRounded />
                        <DatePicker
                            className="w-full ml-3 text-sm bg-transparent border-none outline-none text-gray-700"
                            selected={formData.start_time}
                            onChange={(date) => setFormData({ ...formData, start_time: date })}
                            onFocus={(e) => { e.target.readOnly = true; }}
                            onBlur={(e) => { e.target.readOnly = false; }}
                            placeholderText="Start Date"
                            maxDate={new Date()}
                            dateFormat="dd-MM-yyyy"
                            showYearDropdown
                            scrollableYearDropdown
                        />
                    </div>
                </div>
                <div className="flex items-center w-full p-3 border rounded-md border-gray-300 focus-within:border-blue-500">
                    <AccessTimeFilledRounded />
                    <input
                        className="w-full ml-3 text-sm bg-transparent border-none outline-none text-gray-700"
                        type="number"
                        placeholder="Time taken (in minutes)"
                        name="time_taken"
                        value={formData.time_taken}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="flex items-start w-full p-3 border rounded-md border-gray-300 focus-within:border-blue-500">
                    <AddTaskRounded />
                    <textarea
                        className="w-full h-24 ml-3 text-sm bg-transparent border-none outline-none resize-none text-gray-700"
                        placeholder="Task Description"
                        name="task_description"
                        value={formData.task_description}
                        onChange={handleInputChange}
                    />
                </div>
                {errorMessage?.apierror && (
                    <p className="text-sm text-red-500">{errorMessage.apierror}</p>
                )}
            </form>
            <button
                onClick={(e) => {
                    setErrorMessage({
                        ...errorMessage,
                        apierror: ""
                    });
                    handleSubmit(e);
                }}
                className={`w-full py-3 mt-4 text-sm font-semibold text-white rounded-md transition-colors duration-300 ${buttonDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                disabled={buttonDisabled}
            >
                {loading ? (
                    <CircularProgress size={24} color="inherit" />
                ) : (
                    'Create Task'
                )}
            </button>
        </div>
    )
}

export default CreateTask