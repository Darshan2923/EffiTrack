import React from 'react';
import { useSelector } from 'react-redux';
import { MdPerson, MdEmail, MdPhone, MdWork, MdDateRange, MdLock } from 'react-icons/md';
import moment from 'moment';

const Profile = ({ setOpenUpdateDetails, setOpenChangePassword }) => {
    const { currentUser, role } = useSelector((state) => state.user);
    const userRole = role.charAt(0).toUpperCase() + role.slice(1);

    // Generate color for avatar
    const generateColor = (name) => {
        const nameHash = name
            .toLowerCase()
            .split("")
            .reduce((hash, char) => {
                const charCode = char.charCodeAt(0);
                return (((hash % 65536) * 65536) % 2147483648) + charCode;
            }, 0);

        const hue = nameHash % 360;
        const saturation = 75;
        const lightness = 40;

        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
            <div className="flex gap-8 mb-6">
                <div
                    className="w-32 h-32 rounded-full flex items-center justify-center text-4xl text-white"
                    style={{ backgroundColor: generateColor(currentUser?.username) }}
                >
                    {currentUser?.username[0]}
                </div>
                <div className="flex flex-col">
                    <span className="text-2xl font-semibold">{currentUser?.username}</span>
                    <span className="text-blue-500">{currentUser?.email}</span>
                    <div className="flex gap-2 mt-2">
                        <span className="px-3 py-1 rounded-lg bg-blue-200 text-blue-600 text-sm">{userRole}</span>
                        {currentUser.active ? (
                            <span className="px-3 py-1 rounded-lg bg-green-200 text-green-600 text-sm">Active</span>
                        ) : (
                            <span className="px-3 py-1 rounded-lg bg-yellow-200 text-yellow-600 text-sm">Deactivated</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-6">
                <div className="text-lg font-medium">Update Your Account</div>
                <form className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                        <label className="text-md font-medium">Username</label>
                        <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-100">
                            <MdPerson className="text-gray-600 mr-2" />
                            {currentUser?.username}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-md font-medium">Email</label>
                        <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-100">
                            <MdEmail className="text-gray-600 mr-2" />
                            {currentUser?.email}
                        </div>
                    </div>

                    {role === "employee" && (
                        <>
                            <div className="flex flex-col gap-2">
                                <label className="text-md font-medium">Contact Number</label>
                                <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-100">
                                    <MdPhone className="text-gray-600 mr-2" />
                                    {currentUser?.contact_number}
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex flex-col gap-2 flex-1">
                                    <label className="text-md font-medium">Department</label>
                                    <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-100">
                                        <MdWork className="text-gray-600 mr-2" />
                                        {currentUser?.department}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 flex-1">
                                    <label className="text-md font-medium">Joining Date</label>
                                    <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-100">
                                        <MdDateRange className="text-gray-600 mr-2" />
                                        {moment(currentUser.joining_date).format("DD-MM-YYYY")}
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="flex flex-col gap-2">
                        <label className="text-md font-medium">Password</label>
                        <div className="flex items-center p-3 border border-gray-300 rounded-lg bg-gray-100">
                            <MdLock className="text-gray-600 mr-2" />
                            <input
                                type="password"
                                className="bg-transparent border-none outline-none w-full text-gray-600"
                                value="124359809"
                                readOnly
                            />
                            <button
                                type="button"
                                className="text-blue-500 text-sm ml-2"
                                onClick={() => setOpenChangePassword(true)}
                            >
                                Change Password?
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="bg-blue-500 text-white py-3 rounded-lg font-semibold mt-4 hover:bg-blue-600 transition"
                        onClick={(e) => {
                            e.preventDefault();
                            setOpenUpdateDetails(true);
                        }}
                    >
                        Update Details
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Profile;
