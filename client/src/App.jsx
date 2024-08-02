import React, { useEffect, useState } from 'react'
import Authentication from './pages/Authentication';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import Profile from './pages/Profile';


const App = () => {
  const { currentUser, role } = useSelector((state) => state.user);
  const [openUpdateDetails, setOpenUpdateDetails] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const [openChangePassword, setOpenChangePassword] = useState(false);

  // set the menuOpen state to false if the screen size is less than 768px
  useEffect(() => {
    const resize = () => {
      if (window.innerWidth < 1110) {
        setMenuOpen(false);
      } else {
        setMenuOpen(true);
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);


  return (
    <>
      {currentUser ?
        (
          <div>
            <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
            <Routes>
              <Route path='/' element={
                role === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <EmployeeDashboard
                    setOpenCreateTask={setOpenCreateTask}
                  />
                )
              } />
              <Route
                path="/profile"
                element={
                  <Profile
                    setOpenUpdateDetails={setOpenUpdateDetails}
                    setOpenChangePassword={setOpenChangePassword}
                  />
                }
              />
            </Routes>
          </div>
        ) : <Authentication />}

    </>
  )
}

export default App