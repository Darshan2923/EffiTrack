import React, { useEffect, useState } from 'react'
import { updatePassword } from '../api/apiList';

const ChangePassword = ({ setOpenChangePassword }) => {

    // Hooks
    const token = localStorage.getItem("effitrack-token");
    const [loading, setLoading] = useState(false);
    const [password, setPassword] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [errorMessage, setErrorMessage] = useState({
        oldPassword: "",
        password: "",
        confirmPassword: ""
    });
    const [formData, setFormData] = useState({
        oldPassword: "",
        password: "",
        confirmPassword: ""
    });

    //   Functions
    // Set the text input fields ans perform all validation
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "oldPassword") {
            if (value && value === formData.password) {
                setErrorMessage({
                    ...errorMessage,
                    oldPassword: "Same as previous password"
                });
                setButtonDisabled(true);
            } else {
                setErrorMessage({
                    ...errorMessage,
                    oldPassword: ""
                });
            }
        }
        if (name === 'password') {
            if (!value) {
                setButtonDisabled(true);
            }
            // Password validation regex pattern
            if (value && value === formData.oldPassword) {
                setErrorMessage({
                    ...errorMessage,
                    password: "Same as previous password"
                });
                setButtonDisabled(true);
            } else if (value && value.length < 8) {
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
            } else if (
                formData.confirmPassword &&
                formData.confirmPassword !== value
            ) {
                setErrorMessage({
                    ...errorMessage,
                    confirmPassword: "Passwords do not match!"
                });
                setButtonDisabled(true);
            } else {
                setErrorMessage({
                    ...errorMessage,
                    password: ""
                });
            }
        }


        if (name === "confirmPassword") {
            if (!value) {
                setButtonDisabled(true);
            }
            if (value && value !== formData.password) {
                setErrorMessage({
                    ...errorMessage,
                    confirmPassword: "Passwords do not match!"
                });
                setButtonDisabled(true);
            } else {
                setErrorMessage({
                    ...errorMessage,
                    confirmPassword: ""
                });
            }
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        // If there is no error message and all the fields are filled, then enable the button
        if (
            !errorMessage.oldPassword &&
            !errorMessage.password &&
            !errorMessage.confirmPassword &&
            formData.oldPassword &&
            formData.password &&
            formData.confirmPassword
        ) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [errorMessage, formData]);

    //   Performs the form submit
    const handleSubmit = (e) => {
        e.preventDefault();

        // If there is no error message
        if (!buttonDisabled) {
            setLoading(true);
            setButtonDisabled(true);
            updatePassword(formData, token)
                .then((res) => {
                    if (res.status === 200) {
                        toast.success("Password updated successfully");

                        setLoading(false);
                        setButtonDisabled(false);
                        setErrorMessage({
                            ...errorMessage,
                            apierror: ""
                        });
                        setOpenChangePassword(false);
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
                        toast.error("An error occured: ", err.message);
                    }
                })
        }
    }



    return (
        <>
            <div class="fixed inset-0 flex items-center justify-center">
                <div class="bg-white w-full max-w-md mx-auto rounded-lg shadow-lg overflow-hidden">
                    <div class="py-6 px-8">
                        <h2 class="text-xl font-bold mb-4">Change Password</h2>
                        <div class="absolute top-6 right-6 cursor-pointer" onClick={() => setOpenChangePassword(false)}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-7 h-7 text-gray-600 fill-current">
                                <path d="M18.29 5.71a1 1 0 1 1 1.42 1.42l-5.3 5.3 5.3 5.3a1 1 0 1 1-1.42 1.42l-5.3-5.3-5.3 5.3a1 1 0 1 1-1.42-1.42l5.3-5.3-5.3-5.3a1 1 0 0 1 0-1.42 1 1 0 0 1 1.42 0l5.3 5.3 5.3-5.3z" />
                            </svg>
                        </div>
                        <form>
                            <div class="mb-4 relative">
                                <input name="oldPassword" type={showPassword ? "text" : "password"} placeholder="Old Password" value={formData.oldPassword} onChange={(e) => handleInputChange(e)} class="border border-gray-300 rounded-md px-4 py-2 w-full" />
                                <div class="absolute top-2 right-4">
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6 text-gray-400 fill-current cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                            <path d="M11.98 4C6.47 4 2 8.48 2 13s4.47 9 9.98 9C17.52 22 22 17.52 22 13S17.52 4 11.98 4zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6zM12 8c-.47 0-.93.07-1.37.2l2.57 2.57c.13-.44.2-.9.2-1.37 0-1.1-.9-2-2-2zm0 10c-.47 0-.93-.07-1.37-.2l2.57-2.57c.13.44.2.9.2 1.37 0 1.1-.9 2-2 2zm8.13-4.81l-1.42-1.42C19.54 10.37 20 11.65 20 13s-.46 2.63-1.29 3.64l1.42 1.42C21.35 16.65 22 14.89 22 13s-.65-3.65-1.87-5.81z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6 text-gray-400 fill-current cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                            <path d="M12 6C7.03 6 3 10.03 3 15s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-2c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zM12 8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            {errorMessage?.oldPassword && (
                                <p class="text-red-500">{errorMessage.oldPassword}</p>
                            )}
                            <div class="mb-4 relative">
                                <input name="password" type={showPassword ? "text" : "password"} placeholder="New Password" value={formData.password} onChange={(e) => handleInputChange(e)} class="border border-gray-300 rounded-md px-4 py-2 w-full" />
                                <div class="absolute top-2 right-4">
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6 text-gray-400 fill-current cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                            <path d="M12 6C7.03 6 3 10.03 3 15s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-2c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zM12 8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="w-6 h-6 text-gray-400 fill-current cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                            <path d="M12 6C7.03 6 3 10.03 3 15s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7zm0-2c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3zM12 8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                            {errorMessage?.password && (
                                <p class="text-red-500">{errorMessage.password}</p>
                            )}
                            <div class="mb-4">
                                <input type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={(e) => handleInputChange(e)} class="border border-gray-300 rounded-md px-4 py-2 w-full" />
                            </div>
                            {errorMessage?.confirmPassword && (
                                <p class="text-red-500">{errorMessage.confirmPassword}</p>
                            )}
                            {errorMessage?.apierror && (
                                <p class="text-red-500">{errorMessage.apierror}</p>
                            )}
                        </form>
                        <button onClick={(e) => {
                            setErrorMessage({
                                ...errorMessage,
                                apierror: ""
                            });
                            handleSubmit(e);
                        }} disabled={buttonDisabled} class="w-full py-2 bg-blue-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                            {loading ? (
                                <svg class="animate-spin h-5 w-5 mr-3 border-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.373A8.001 8.001 0 0112 4v4a4 4 0 00-4 4H6zm2 5.373A8.001 8.001 0 014 12h4a4 4 0 004 4v4zm7-9.373a4 4 0 00-4-4V4a8.001 8.001 0 016 3.464V7z"></path>
                                </svg>
                            ) : (
                                <>Update</>
                            )}
                        </button>
                    </div>
                </div>
            </div>

        </>
    );
}

export default ChangePassword