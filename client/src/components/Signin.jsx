import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { AdminLogin, EmployeeLogin } from '../api'
import { loginSuccess } from '../redux/reducers/userSlice'
import { openSnackbar } from '../redux/reducers/snackbarSlice'
import ForgetPassword from './ForgetPassword';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';

const Signin = ({ setOpenSignUp }) => {
    // hooks
    const [showPassword, setShowPassword] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState("admin");

    // reset password
    const [showForgotPassword, setShowForgotPassword] = useState(false);

    const dispatch = useDispatch();
    const [errorMessage, setErrorMessage] = useState({
        email: ""
    }); // error message for validation checks.
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    // handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // validation checks
        if (name === "email") {
            // Email validation regex pattern
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!value) {
                setButtonDisabled(true);
            }

            if (value && !emailRegex.test(value)) {
                setErrorMessage({
                    ...errorMessage,
                    email: "Enter correct email format"
                });
                setButtonDisabled(true);
            } else {
                setErrorMessage({
                    ...errorMessage,
                    email: ""
                });
            }
        }

        if (name === "password") {
            if (!value) {
                setButtonDisabled(true);
            }
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    useEffect(() => {
        // If there is no error message and all the fields are filled, then enable the button
        if (!errorMessage.email && formData.email && formData.password) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [errorMessage, formData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // If there is no error message, then submit the form
        if (!buttonDisabled) {
            setLoading(true);
            setButtonDisabled(true);
            if (selectedOption === "admin") {
                AdminLogin(formData)
                    .then((res) => {
                        if (res.status === 200) {
                            dispatch(loginSuccess(res.data));
                            dispatch(
                                openSnackbar({
                                    message: "Login Successful",
                                    severity: "success"
                                })
                            );
                            setLoading(false);
                            setButtonDisabled(false);
                            setErrorMessage({
                                ...errorMessage,
                                apierror: ""
                            });
                        }
                    })
                    .catch((err) => {
                        setButtonDisabled(false);
                        if (err.response) {
                            setLoading(false);
                            setErrorMessage({
                                ...errorMessage,
                                apierror: err.response.data.message
                            });
                        } else {
                            setLoading(false);
                            dispatch(
                                openSnackbar({
                                    message: err.message,
                                    severity: "error"
                                })
                            );
                        }
                    });
            } else {
                EmployeeLogin(formData)
                    .then((res) => {
                        if (res.status === 200) {
                            dispatch(loginSuccess(res.data));
                            dispatch(
                                openSnackbar({
                                    message: "Login Successful",
                                    severity: "success"
                                })
                            );
                            setLoading(false);
                            setButtonDisabled(false);
                            setErrorMessage({
                                ...errorMessage,
                                apierror: ""
                            });
                        }
                    })
                    .catch((err) => {
                        setButtonDisabled(false);
                        if (err.response) {
                            setLoading(false);
                            setErrorMessage({
                                ...errorMessage,
                                apierror: err.response.data.message
                            });
                        } else {
                            setLoading(false);
                            dispatch(
                                openSnackbar({
                                    message: err.message,
                                    severity: "error"
                                })
                            );
                        }
                    });
            }
        }
    };

    return (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md flex flex-col gap-4">
            {showForgotPassword ? (
                <ForgetPassword setShowForgotPassword={setShowForgotPassword} />
            ) : (
                <div>
                    <h1 className="text-2xl font-medium text-gray-900">Sign In</h1>
                    <div className="flex justify-between items-center px-1 mb-2">
                        <div
                            className={`w-full px-4 py-2 border-b-2 text-center font-semibold cursor-pointer transition ${selectedOption === 'admin' ? 'text-blue-500 border-blue-500' : 'border-transparent'
                                }`}
                            onClick={() => handleOptionClick('admin')}
                        >
                            Admin
                        </div>
                        <div
                            className={`w-full px-4 py-2 border-b-2 text-center font-semibold cursor-pointer transition ${selectedOption === 'employee' ? 'text-blue-500 border-blue-500' : 'border-transparent'
                                }`}
                            onClick={() => handleOptionClick('employee')}
                        >
                            Employee
                        </div>
                    </div>
                    <form className="flex flex-col gap-4 mt-4">
                        <div className="flex items-center border border-gray-300 rounded-lg p-3 gap-2">
                            <FaEnvelope className="text-gray-400" />
                            <input
                                className="w-full outline-none bg-transparent text-gray-700"
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        {errorMessage?.email && (
                            <p className="text-xs text-red-500">{errorMessage.email}</p>
                        )}

                        <div className="flex items-center border border-gray-300 rounded-lg p-3 gap-2">
                            <FaLock className="text-gray-400" />
                            <input
                                className="w-full outline-none bg-transparent text-gray-700"
                                placeholder="Password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            {showPassword ? (
                                <FaEye
                                    className="text-gray-400 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            ) : (
                                <FaEyeSlash
                                    className="text-gray-400 cursor-pointer"
                                    onClick={() => setShowPassword(!showPassword)}
                                />
                            )}
                        </div>
                        {errorMessage?.apierror && (
                            <p className="text-xs text-red-500">{errorMessage.apierror}</p>
                        )}
                        {selectedOption === 'admin' && (
                            <p
                                className="text-sm text-right text-gray-500 cursor-pointer hover:text-blue-500 transition"
                                onClick={() => setShowForgotPassword(true)}
                            >
                                Forgot password?
                            </p>
                        )}
                    </form>
                    <button
                        className={`w-full py-3 mt-4 rounded-lg text-white text-lg font-semibold transition ${buttonDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500'
                            }`}
                        onClick={handleSubmit}
                        disabled={buttonDisabled}
                    >
                        {loading ? (
                            <div className="animate-spin mx-auto h-5 w-5 border-4 border-t-transparent border-white rounded-full"></div>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                    <p className="text-center text-gray-700 mt-4">
                        Don't have an account?{' '}
                        <span
                            className="text-blue-500 cursor-pointer font-semibold transition"
                            onClick={() => setOpenSignUp(true)}
                        >
                            Sign Up
                        </span>
                    </p>
                </div>
            )}
        </div>
    );
}

export default Signin