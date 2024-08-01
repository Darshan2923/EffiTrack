import React, { useEffect, useState } from 'react'
import Authentication from './pages/Authentication';
import { useSelector } from 'react-redux';
import { Routes, Route } from 'react-router-dom';


const App = () => {
  const { currentUser, role } = useSelector((state) => state.user);
  const [menuOpen, setMenuOpen] = useState(true);

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
            </Routes>
          </div>
        ) : <Authentication />}

    </>
  )
}

export default App