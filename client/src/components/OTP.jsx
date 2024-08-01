import OtpInput from 'react-otp-input';
import { useDispatch } from 'react-redux';
import { openSnackbar } from '../redux/reducers/snackbarSlice';
import { generateOtp, verifyOtp } from '../api';
import { useEffect, useRef, useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Updated import for react-router-dom v6

const OTP = ({ email, name, setOtpVerified, reason }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Updated for react-router-dom v6
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    const [otpLoading, setOtpLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [showTimer, setShowTimer] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState("00:00");

    const Ref = useRef(null);

    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return {
            total,
            minutes,
            seconds
        };
    };

    const startTimer = (e) => {
        const { total, minutes, seconds } = getTimeRemaining(e);
        if (total >= 0) {
            setTimer(`${minutes > 9 ? minutes : "0" + minutes}:${seconds > 9 ? seconds : "0" + seconds}`);
        }
    };

    const clearTimer = (e) => {
        setTimer("01:00");
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(e);
        }, 1000);
        Ref.current = id;
    };

    const getDeadTime = () => {
        const deadline = new Date();
        deadline.setSeconds(deadline.getSeconds() + 60);
        return deadline;
    };

    const sendOtp = async () => {
        console.log('Sending OTP');
        await generateOtp(email, name, reason)
            .then((res) => {
                if (res.status === 200) {
                    dispatch(openSnackbar({ message: "OTP sent successfully", severity: "success" }));
                    setDisabled(true);
                    setOtp("");
                    setOtpError("");
                    setOtpLoading(false);
                    setOtpSent(true);
                } else {
                    dispatch(openSnackbar({ message: res.status, severity: "error" }));
                    setOtp("");
                    setOtpError("");
                    setOtpLoading(false);
                }
            })
            .catch((err) => {
                dispatch(openSnackbar({ message: err.message, severity: "error" }));
                setOtp("");
                setOtpError("");
                setOtpLoading(false);
            });
    };

    const resendOtp = () => {
        console.log('Resending OTP');
        setShowTimer(true);
        clearTimer(getDeadTime());
        sendOtp();
    };

    const validateOtp = () => {
        console.log('Validating OTP:', otp);
        setOtpLoading(true);
        setDisabled(true);
        verifyOtp(otp)
            .then((res) => {
                console.log('OTP Validation Response:', res);
                if (res.status === 200) {
                    setOtpVerified(true);
                    setOtp("");
                    setOtpError("");
                    setDisabled(false);
                    setOtpLoading(false);
                    navigate('/home'); // Use navigate instead of history.push
                }
            })
            .catch((err) => {
                console.error('OTP Validation Error:', err);
                if (err.response) {
                    setOtpError(err.response.data.message);
                } else {
                    dispatch(openSnackbar({ message: err.message, severity: "error" }));
                    setOtpError(err.message);
                }
                setDisabled(false);
                setOtpLoading(false);
            });
    };


    useEffect(() => {
        console.log('Initial OTP Send');
        clearTimer(getDeadTime());
        sendOtp();
    }, []);

    useEffect(() => {
        if (timer === "00:00") {
            setShowTimer(false);
        } else {
            setShowTimer(true);
        }
    }, [timer]);

    useEffect(() => {
        if (otp.length === 6) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }
    }, [otp]);

    return (
        <div className="flex flex-col items-center p-6">
            <h1 className="text-2xl font-medium text-gray-900">VERIFY OTP</h1>
            <div className="text-base font-medium text-gray-600 mt-2">
                A verification <b>OTP</b> has been sent to:
            </div>
            <span className="text-primary text-sm mt-1">{email}</span>

            {!otpSent ? (
                <div className="flex flex-col items-center justify-center p-4 mb-5 text-center">
                    Sending OTP
                    <FaSpinner className="animate-spin text-primary text-xl mt-2" />
                </div>
            ) : (
                <div className="w-full">
                    <div className="flex justify-center my-4">
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            shouldAutoFocus
                            inputStyle="text-lg w-12 h-12 rounded-md border border-gray-300 text-center mx-1 bg-transparent text-gray-900"
                            containerStyle="flex justify-center"
                            renderInput={(props) => <input {...props} />}
                        />
                    </div>

                    {otpError && (
                        <div className="text-red-600 text-xs mb-2">
                            <b>{otpError}</b>
                        </div>
                    )}

                    <button
                        className={`w-full py-3 rounded-lg text-white text-lg font-semibold mt-3 mb-3 transition-colors ${disabled ? 'bg-gray-300 cursor-not-allowed' : 'bg-primary'}`}
                        onClick={validateOtp}
                        disabled={disabled}
                    >
                        {otpLoading ? (
                            <FaSpinner className="animate-spin mx-auto text-white" />
                        ) : (
                            "Submit"
                        )}
                    </button>

                    {showTimer ? (
                        <div className="text-gray-600 text-base mt-2">
                            Resend in <b>{timer}</b>
                        </div>
                    ) : (
                        <div
                            className="text-primary text-base mt-2 cursor-pointer"
                            onClick={resendOtp}
                        >
                            <b>Resend</b>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OTP;
