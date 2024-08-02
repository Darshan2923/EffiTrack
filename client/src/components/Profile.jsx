import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoMdLogOut } from 'react-icons/io';
import { HiOutlineUser } from 'react-icons/hi';
import { MdMenu } from 'react-icons/md';

const Profile = ({ open, handleClose, anchorEl }) => {
    // Hooks
    const { currentUser, role } = useSelector((state) => state.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Functions
    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const userRole = role.charAt(0).toUpperCase() + role.slice(1);

    // generate color for avatar
    const generateColor = (name) => {
        const nameHash = name
            .toLowerCase()
            .split("")
            .reduce((hash, char) => {
                const charCode = char.charCodeAt(0);
                return (((hash % 65536) * 65536) % 2147483648) + charCode;
            }, 0);

        const hue = nameHash % 360;
        const saturation = 75; // Random value between 25 and 100
        const lightness = 40; // Random value between 20 and 80

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center cursor-pointer p-2 border border-gray-300 rounded-lg"
            >
                <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xl"
                    style={{ backgroundColor: generateColor(currentUser.username) }}
                >
                    {currentUser.username[0]}
                </div>
                <MdMenu className="ml-2 text-gray-600" />
            </button>
            {open && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-gray-900 p-4 shadow-lg rounded-lg transition-transform transform scale-100 opacity-100">
                    <div className="flex flex-col items-center">
                        <div
                            className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl"
                            style={{ backgroundColor: generateColor(currentUser.username) }}
                        >
                            {currentUser.username[0]}
                        </div>
                        <div className="text-center mt-4">
                            <p className="font-bold text-lg">{currentUser.username}</p>
                            <p className="text-sm text-gray-500">{userRole}</p>
                        </div>
                        <div className="mt-4 flex flex-col items-center">
                            <button
                                onClick={() => navigate("/profile")}
                                className="flex items-center text-blue-500 hover:text-blue-700"
                            >
                                <HiOutlineUser className="mr-2" />
                                View Profile
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-red-500 hover:text-red-700 mt-2"
                            >
                                <IoMdLogOut className="mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                    <hr className="my-4 border-gray-300" />

                </div>
            )}
        </div>
    );
};

export default Profile;
