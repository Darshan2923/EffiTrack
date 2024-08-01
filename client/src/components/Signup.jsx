import { useDispatch } from 'react-redux';
import { openSnackbar } from '../redux/reducers/snackbarSlice';
import { loginSuccess } from '../redux/reducers/userSlice';
import { AdminRegister, findUserByEmail } from '../api';
import OTP from './OTP';
import React, { useState, useEffect } from 'react'
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';

const Signup = ({ setOpenSignUp }) => {// hooks
    const dispatch = useDispatch();
    const [showPassword, setShowPassword] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        username: "",
        email: "",
        password: ""
    }); // error message for validation checks.
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: ""
    });
    const [confirmPassword, setConfirmPassword] = useState("");

    // Verify OTP
    const [otpVerified, setOtpVerified] = useState(false);
    const [showOtp, setShowOtp] = useState(false);

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
            // Password validation regex pattern
            if (value && value.length < 8) {
                setErrorMessage({
                    ...errorMessage,
                    password: "Password must be atleast 8 characters long!"
                });
                setButtonDisabled(true);
            } else if (value && value.length > 16) {
                setErrorMessage({
                    ...errorMessage,
                    password: "Password must be less than 16 characters long!"
                });
                setButtonDisabled(true);
            } else if (
                value &&
                (!value.match(/[a-z]/g) ||
                    !value.match(/[A-Z]/g) ||
                    !value.match(/[0-9]/g) ||
                    !value.match(/[^a-zA-Z\d]/g))
            ) {
                setErrorMessage({
                    ...errorMessage,
                    password:
                        "Password must contain atleast one lowercase, uppercase, number and special character!"
                });
                setButtonDisabled(true);
            } else {
                setErrorMessage({
                    ...errorMessage,
                    password: ""
                });
            }
        }

        if (name === "username") {
            if (!value) {
                setButtonDisabled(true);
            }
            // Username validation regex pattern
            const usernameRegex = /^[A-Za-z0-9\s]+$/;

            if (value && !usernameRegex.test(value)) {
                setErrorMessage({
                    ...errorMessage,
                    username: "Username must contain only letters, numbers and spaces"
                });
                setButtonDisabled(true);
            } else {
                setErrorMessage({
                    ...errorMessage,
                    username: ""
                });
            }
        }

        if (name === "Confirm password") {
            setConfirmPassword(value);
            if (value !== formData.password) {
                setErrorMessage({
                    ...errorMessage,
                    confirm_password: "Password does not match"
                });
                setButtonDisabled(true);
            } else {
                setErrorMessage({
                    ...errorMessage,
                    confirm_password: ""
                });
            }
        }

        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    useEffect(() => {
        // If there is no error message and all the fields are filled, then enable the button
        if (
            !errorMessage.username &&
            !errorMessage.email &&
            !errorMessage.password &&
            formData.username &&
            formData.email &&
            formData.password &&
            confirmPassword === formData.password
        ) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [confirmPassword, errorMessage, formData]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!buttonDisabled) {
            try {
                console.log("Sending OTP request")
                setShowOtp(true); // Trigger OTP flow
                setLoading(false);
                setErrorMessage({
                    ...errorMessage,
                    apierror: ""
                });
            } catch (err) {
                console.error(err);
            }
        }
    };


    const createAccount = () => {
        setShowOtp(false);
        setLoading(true);
        setButtonDisabled(true);
        AdminRegister(formData)
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
                setLoading(false);
                setButtonDisabled(false);
                if (err.response) {
                    setErrorMessage({
                        ...errorMessage,
                        apierror: err.response.data.message
                    });
                } else {
                    setErrorMessage({
                        ...errorMessage,
                        apierror: err.message
                    });
                }
            });
    };

    useEffect(() => {
        if (otpVerified) {
            createAccount();
        }
    }, [otpVerified]);

    return (
        <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md flex flex-col gap-4">
            {!showOtp ? (
                <div>
                    <h1 className="text-2xl font-medium text-gray-900">SignUp</h1>
                    <form className="flex flex-col gap-4 mt-4">
                        <div className="flex items-center border border-gray-300 rounded-lg p-3 gap-2">
                            <FaUser className="text-gray-400" />
                            <input
                                className="w-full outline-none bg-transparent text-gray-700"
                                placeholder="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                maxLength={16}
                            />
                        </div>
                        {errorMessage?.username && (
                            <p className="text-xs text-red-500">{errorMessage.username}</p>
                        )}

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
                                <FaEye className="text-gray-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                            ) : (
                                <FaEyeSlash className="text-gray-400 cursor-pointer" onClick={() => setShowPassword(!showPassword)} />
                            )}
                        </div>
                        {errorMessage?.password && (
                            <p className="text-xs text-red-500">{errorMessage.password}</p>
                        )}

                        <div className="flex items-center border border-gray-300 rounded-lg p-3 gap-2">
                            <FaLock className="text-gray-400" />
                            <input
                                className="w-full outline-none bg-transparent text-gray-700"
                                placeholder="Confirm Password"
                                name="confirm_password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                        {errorMessage?.confirm_password && (
                            <p className="text-xs text-red-500">{errorMessage.confirm_password}</p>
                        )}

                        {errorMessage?.apierror && (
                            <p className="text-xs text-red-500">{errorMessage.apierror}</p>
                        )}
                    </form>

                    <button
                        className={`w-full py-3 mt-4 rounded-lg text-white text-lg font-semibold transition-colors ${buttonDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500'}`}
                        onClick={handleSubmit}
                        disabled={buttonDisabled}
                    >
                        {loading ? (
                            <div className="animate-spin mx-auto h-5 w-5 border-4 border-t-transparent border-white rounded-full"></div>
                        ) : (
                            "Create Account"
                        )}
                    </button>

                    <p className="text-center text-gray-600 mt-4">
                        Already have an account?{" "}
                        <span
                            className="text-blue-500 cursor-pointer font-semibold"
                            onClick={() => setOpenSignUp(false)}
                        >
                            Sign In
                        </span>
                    </p>
                </div>
            ) : (
                <OTP
                    email={formData.email}
                    name={formData.email}
                    otpVerified={otpVerified}
                    setOtpVerified={setOtpVerified}
                    reason="FORGOTPASSWORD"
                />
            )}
        </div>
    );
}

export default Signup