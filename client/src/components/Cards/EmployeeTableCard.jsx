import React from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { FaUser, FaEnvelope, FaPhone, FaBriefcase, FaCalendarAlt } from 'react-icons/fa'; // Example icons, replace with your choice

const EmployeeTableCard = ({ employee }) => {
    const navigate = useNavigate();

    // Generate color for avatar
    const generateColor = (name) => {
        const nameHash = name
            ?.toLowerCase()
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
        <div
            className="w-full flex items-center p-4 bg-card text-text_primary gap-3 hover:bg-card_hover transition-all duration-500 ease-in-out cursor-pointer"
            onClick={() => navigate(`/employee/${employee._id}`)}
        >
            <div className="w-1/3 flex items-center justify-center">
                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundColor: generateColor(employee?.username) }}
                >
                    {employee?.username[0]}
                </div>
            </div>
            <div className="w-2/5 flex flex-col gap-1 text-sm sm:text-base">
                <b>{employee?.username}</b>
                <span className="text-blue-500">{employee?.email}</span>
            </div>
            <div className="w-1/5 text-sm sm:text-base">
                <FaPhone className="inline mr-1" />
                {employee?.contact_number}
            </div>
            <div className="w-1/5 text-sm sm:text-base">
                <FaBriefcase className="inline mr-1" />
                {employee?.department}
            </div>
            <div className="w-1/5 text-sm sm:text-base">
                <FaCalendarAlt className="inline mr-1" />
                {moment(employee?.joining_date).format('DD-MM-YYYY')}
            </div>
            <div className="w-fit text-sm sm:text-base">
                {employee?.active ? (
                    <span className="bg-green-100 text-green-600 py-1 px-3 rounded-full">Active</span>
                ) : (
                    <span className="bg-yellow-100 text-yellow-600 py-1 px-3 rounded-full">Deactivated</span>
                )}
            </div>
        </div>
    );
};

export default EmployeeTableCard;
