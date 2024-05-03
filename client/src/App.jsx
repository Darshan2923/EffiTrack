import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import AdminDashboard from './pages/AdminDashboard'
import EmployeeDashboard from './pages/EmployeeDashboard'

const App = () => {
  const [openCreateTask, setOpenCreateTask] = useState(false);
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={
          role === "admin" ? (<AdminDashboard />) : (<EmployeeDashboard setOpenCreateTask={setOpenCreateTask} />)
        } />
      </Routes>
      <Footer />
    </div>
  )
}

export default App