import React, { useEffect, useRef, useState } from 'react';
import OtpInput from 'react-otp-input';
import { ToastContainer, toast } from 'react-toastify'
import { generateOtp, verifyOtp } from '../api/apiList';

const OTP = ({ email, name, setOtpVerify, reason }) => {
    const [otp, setOtp] = useState("");
    const [otpError, setOtpError] = useState("")
    const [otpLoading, setOtpLoading] = useState(false);
    const [disable, setDisable] = useState(true);
    const [showTimer, setShowTimer] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [timer, setTimer] = useState("00:00");

    const Ref = useRef(null);

    // Counter for timer
    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 / 60 / 60) % 24);
        return {
            total, hours, minutes, seconds
        }
    }

    const startTimer = (e) => {
        const { total, minutes, seconds } = getTimeRemaining(e);
        if (total >= 0) {
            // update the timer
            // check if less than 10 then we need to
            // add '0' at the beginning of the variable
            setTimer(
                `${minutes > 9 ? minutes : 0}: ${seconds > 9 ? seconds : 0} seconds`
            );
        }
    };

    const clearTimer = (e) => {
        setTimer("01:00");
        // updating of timer Variable will be
        // after 1000ms or 1sec
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

    // sends the otp to user email id
    const sendOtp = async () => {
        await generateOtp(email, name, reason)
            .then((res) => {
                if (res.status === 200) {
                    toast.success("OTP sent Successfully");
                    setDisable(true);
                    setOtp("");
                    setOtpError("");
                    setOtpLoading(false);
                    setOtpSent(true);
                } else {
                    toast.error("An error occured");
                    setOtp("");
                    setOtpError("");
                    setOtpLoading(false);
                }
            })
            .catch((err) => {
                toast.error("An error occured");
            });
    }

    const resendOtp = () => {
        setShowTimer(true);
        clearTimer(getDeadTime());
        sendOtp();
    };

    // Validate the entered otp
    const validOtp = () => {
        setOtpLoading(true);
        setDisable(true);
        verifyOtp(otp)
            .then((res) => {
                if (res.status === 200) {
                    setOtpVerify(true);
                    setOtp("");
                    setOtpError("");
                    setDisable(false);
                    setOtpLoading(false);
                }
            })
            .catch((err) => {
                if (err.response) {
                    setOtpError(err.response.data.message);
                    setDisable(false);
                    setOtpLoading(false);
                } else {
                    toast.error(err.message);
                    setDisable(false);
                    setOtpLoading(false);
                }
            })
    };

    // Check if timer is 00:00 then hide the timer
    useEffect(() => {
        if (timer === "00:00") {
            setShowTimer(false);
        } else {
            setShowTimer(true);
        }
    }, [timer]);

    // Check if the otp is 6 digits then enable the submit button
    useEffect(() => {
        if (otp.length === 6) {
            setDisable(false);
        } else {
            setDisable(true);
        }
    }, [otp]);

    return (
        <>
            <ToastContainer />
            <h2>VERIFY OTP</h2>
            <p>A verification <b>&nbsp;OTP &nbsp;</b> has been sent to:{" "} </p>
            <span>{email}</span>
            {!otpSent ? (
                <div className="py-[12px] px-[26px] mb-[20px] text-center flex flex-col items-center gap-[14px] justify-center">
                    Sending OTP
                </div>
            ) : (
                <div>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        shouldAutoFocus
                        inputStyle={{
                            fontSize: "22px",
                            height: "48px",
                            width: "48px",
                            borderRadius: "5px",
                            border: "1px solid #ccc",
                            textAlign: "center",
                            margin: "6px 4px",
                            backgroundColor: "transparent",
                            color: 'white'
                        }}
                        containerStyle={{ padding: "8px 2px", justifyContent: "center" }}
                        renderInput={(props) => <input {...props} />}
                    />
                    <b>{otpError}</b>
                    <button disabled={disable} style={{ marginTop: "12px", marginBottom: "12px" }} onClick={() => validOtp()}>
                        {otpLoading ? (
                            "Loading..."
                        ) : (
                            "Submit"
                        )}
                    </button>
                    {
                        showTimer ? (
                            `Resend in ${timer}`
                        ) : (
                            <b onClick={() => resendOtp()}>Resend</b>
                        )
                    }
                </div>
            )}
        </>
    )
}

export default OTP