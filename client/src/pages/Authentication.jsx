import React, { useState } from 'react';
import Signin from '../components/Signin'; // Assuming SignIn component is in the same directory
import Signup from '../components/Signup'; // Assuming SignUp component is in the same directory
import Logo from '../Images/Logo.svg'; // Path to your logo

const Authentication = () => {
    const [openSignUp, setOpenSignUp] = useState(false);
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 md:justify-start">
            <div className="text-4xl font-bold flex items-center uppercase bg-gradient-to-r from-purple-700 to-pink-500 bg-clip-text text-transparent mb-1 md:text-3xl">
                <img src={Logo} alt="logo" className="h-9 mr-2 md:h-7" />
                Trackophile
            </div>
            <div className="text-lg font-semibold text-gray-600 mb-9 md:text-sm">
                {openSignUp ? 'Welcome to Trackophile!' : 'Welcome back to Trackophile!'}
            </div>
            {openSignUp ? (
                <Signup setOpenSignUp={setOpenSignUp} />
            ) : (
                <Signin setOpenSignUp={setOpenSignUp} />
            )}
        </div>
    );
};

export default Authentication;
