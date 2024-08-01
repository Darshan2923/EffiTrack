import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { openSnackbar } from '../redux/reducers/snackbarSlice'
import { findUserByEmail, resetPassword } from '../api/index'
import OTP from './OTP'
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';

const ForgetPassword = () => {
    // Hooks
    const [errorMessage, setErrorMessage] = useState({
        email: "",
        password: ""
    });
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [resetDisabled, setResetDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();

    // verify otp
    const [showOTP, setShowOTP] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    // Sends Otp to the user registered email id
    const sendOtp = () => {
        if (!resetDisabled) {
            setResetDisabled(true);
            setLoading(true);
            findUserByEmail(formData.email)
                .then((res) => {
                    if (res.status === 200) {
                        setShowOTP(true);
                        setResetDisabled(false);
                        setLoading(false);
                    }
                })
                .catch((err) => {
                    setResetDisabled(false);
                    setLoading(false);
                    if (err.response) {
                        setErrorMessage({
                            ...errorMessage,
                            apierror: err.response.data.message
                        });
                    } else {
                        dispatch(
                            openSnackbar({
                                message: err.message,
                                severity: "error"
                            })
                        );
                    }
                });
        }
    };

    // Sets the form input fields
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // validation checks
        if (name === "email") {
            // Email validation regex pattern
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!value) {
                setResetDisabled(true);
            }

            if (value && !emailRegex.test(value)) {
                setErrorMessage({
                    ...errorMessage,
                    email: "Please enter a valid email address!"
                });
                setResetDisabled(true);
            } else {
                setErrorMessage({
                    ...errorMessage,
                    email: ""
                });
            }
        }
        if (name === "password") {
            if (!value) {
                setResetDisabled(true);
            }
            // Password validation regex pattern
            if (value && value.length < 8) {
                setErrorMessage({
                    ...errorMessage,
                    password: "Password must be atleast 8 characters long!"
                });
                setResetDisabled(true);
            } else if (value && value.length > 16) {
                setErrorMessage({
                    ...errorMessage,
                    password: "Password must be less than 16 characters long!"
                });
                setResetDisabled(true);
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
                setResetDisabled(true);
            } else if (
                formData.confirmPassword &&
                formData.confirmPassword !== value
            ) {
                setErrorMessage({
                    ...errorMessage,
                    confirmPassword: "Passwords do not match!"
                });
                setResetDisabled(true);
            } else {
                setErrorMessage({
                    ...errorMessage,
                    password: ""
                });
            }
        }

        if (name === "confirmPassword") {
            if (!value) {
                setResetDisabled(true);
            }
            if (value && value !== formData.password) {
                setErrorMessage({
                    ...errorMessage,
                    confirmPassword: "Passwords do not match!"
                });
                setResetDisabled(true);
            } else {
                setErrorMessage({
                    ...errorMessage,
                    confirmPassword: ""
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
            !errorMessage.email &&
            !errorMessage.password &&
            !errorMessage.confirmPassword &&
            formData.email &&
            formData.password &&
            formData.confirmPassword &&
            formData.password === formData.confirmPassword
        ) {
            setResetDisabled(false);
        } else {
            setResetDisabled(true);
        }
    }, [errorMessage, formData]);


    // After otp is verified this function resets the user updated password
    const performResetPassword = async () => {
        setShowOTP(false);
        setLoading(true);
        setResetDisabled(true);
        await resetPassword(formData.email, formData.password)
            .then((res) => {
                if (res.status === 200) {
                    dispatch(
                        openSnackbar({
                            message: "Password Reset Successfully",
                            severity: "success"
                        })
                    );
                    setShowForgotPassword(false);
                    setLoading(true);
                    setOtpVerified(false);
                }
            })
            .catch((err) => {
                dispatch(
                    openSnackbar({
                        message: err.message,
                        severity: "error"
                    })
                );
                setShowOTP(false);
                setOtpVerified(false);
            });
    };

    useEffect(() => {
        if (otpVerified) {
            performResetPassword();
        }
    });


    return (
        <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-md flex flex-col gap-4">
            {!showOTP ? (
                <>
                    <h1 className="text-2xl font-medium text-gray-900">Reset Password</h1>
                    <FaTimes
                        className="absolute top-2 right-2 text-gray-600 cursor-pointer"
                        onClick={() => setShowForgotPassword(false)}
                    />
                    <form className="flex flex-col gap-4 mt-4">
                        <div className="flex items-center border border-gray-300 rounded-lg p-3 gap-2">
                            <FaEnvelope className="text-gray-400" />
                            <input
                                className="w-full outline-none bg-transparent text-gray-700"
                                name="email"
                                type="text"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => handleInputChange(e)}
                            />
                        </div>
                        {errorMessage?.email && (
                            <p className="text-xs text-red-500">{errorMessage.email}</p>
                        )}

                        <div className="flex items-center border border-gray-300 rounded-lg p-3 gap-2">
                            <FaLock className="text-gray-400" />
                            <input
                                className="w-full outline-none bg-transparent text-gray-700"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={formData.password}
                                onChange={(e) => handleInputChange(e)}
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
                        {errorMessage?.password && (
                            <p className="text-xs text-red-500">{errorMessage.password}</p>
                        )}

                        <div className="flex items-center border border-gray-300 rounded-lg p-3 gap-2">
                            <FaLock className="text-gray-400" />
                            <input
                                className="w-full outline-none bg-transparent text-gray-700"
                                type="password"
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange(e)}
                            />
                        </div>
                        {errorMessage?.confirmPassword && (
                            <p className="text-xs text-red-500">
                                {errorMessage.confirmPassword}
                            </p>
                        )}
                        {errorMessage?.apierror && (
                            <p className="text-xs text-red-500">{errorMessage.apierror}</p>
                        )}
                    </form>
                    <button
                        className={`w-full py-3 mt-4 rounded-lg text-white text-lg font-semibold transition-colors ${resetDisabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-500'}`}
                        onClick={sendOtp}
                        disabled={resetDisabled}
                    >
                        {loading ? (
                            <div className="animate-spin mx-auto h-5 w-5 border-4 border-t-transparent border-white rounded-full"></div>
                        ) : (
                            "Reset Password"
                        )}
                    </button>
                </>
            ) : (
                <OTP
                    email={formData.email}
                    name="User"
                    otpVerified={otpVerified}
                    setOtpVerified={setOtpVerified}
                    reason="FORGOTPASSWORD"
                />
            )}
        </div>
    );
}

export default ForgetPassword