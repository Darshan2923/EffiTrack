import { useState } from "react";
import { useSelector } from "react-redux";
import { MdMenu } from "react-icons/md"; // Importing react-icons
import { Link, useLocation } from "react-router-dom";
import Profile from "./Profile";
import { FaChevronDown } from 'react-icons/fa';
import Logo from '../Images/Logo.svg'

const Navbar = ({ setMenuOpen, menuOpen }) => {
    // Hooks
    const { currentUser } = useSelector((state) => state.user);
    const location = useLocation();

    // Open the account dialog
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const id = open ? "simple-popover" : undefined;

    // Functions
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    // create a color code based on user name
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

    // get the main path from the location
    let path = location.pathname.split("/")[1];
    if (path === "") path = "Dashboard";
    else if (path === "profile") path = "Profile";
    else if (path === "employees") path = "Employees";
    else if (path === "tasks") path = "Tasks";
    else path = "";

    return (
        <div className="w-full bg-light text-primary flex items-center justify-between p-4 md:p-2 shadow-md">
            <div className="flex items-center gap-5 md:gap-2">
                <button className="text-primary hidden md:flex" onClick={setMenuOpen(!menuOpen)}>
                    <MdMenu size={30} />
                </button>
                <div className="text-lg font-semibold hidden md:flex items-center text-transparent bg-gradient-to-r from-purple-800 to-pink-600 bg-clip-text">
                    <img src={Logo} alt="Logo" className="hidden md:block h-5 mr-2" />
                    Trackify
                </div>
            </div>
            <div className="flex items-center gap-2 cursor-pointer" onClick={handleClick}>
                <div
                    src={currentUser?.img}
                    sx={{ fontSize: "16px", backgroundColor: generateColor(currentUser?.username) }}
                >
                    {currentUser?.username[0]}
                </div>
                <span className="font-medium mr-2 hidden md:block">{currentUser?.username}</span>
                <FaChevronDown />
            </div>
            {currentUser && (
                <Profile
                    open={open}
                    anchorEl={anchorEl}
                    id={id}
                    handleClose={handleClose}
                />
            )}
        </div>
    );
};

export default Navbar;
