import React, { useState } from 'react'
import {ToastContainer,toast} from 'react-toastify';
import {getAllEmployees} from '../api';
import EmployeeTableCard from '../components/Cards/EmployeeTableCard';

const AdminDashboard = () => {
    // Hooks
    const token=localStorage.getItem('effitrack-token');
    const [employees,setEmployees]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);

    // fetch employees
    useEffect(()=>{
        const fetchEmployees=async()=>{
            try {
                await getAllEmployees(token).then((res)=>{
                    setEmployees(res.data.employees);
                    setLoading(false);
                });
            } catch (error) {
                setError(error.message);
                setLoading(false);
                if(error.response){
                    setLoading(false);
                    setError(err.response.data.message);
                }else{
                    setLoading(false);
                    toast.error("An error occured");
                }
            }
        };
        fetchEmployees();
    },[token]);

    return (
        <>
        <ToastContainer/>
        {loading || error? (
        <>
        {loading && "Loading..."}
        {error && toast.error(error)}</>
):(
    // Employee list in Table Format
    <div>
        <div className="EmployeeTable">
  <div className="ItemTitle" style={{ fontSize: "20px", smallFontSize: "16px", padding: "16px 22px", margin: "0px" }}>
    Employee List
  </div>
  <div className="TableTop flex">
    <div className="Heading" style={{ width: "30%" }} />
    <div className="Heading" style={{ width: "80%", justifyContent: "start" }}>
      Username
    </div>
    <div className="Heading">Contact No</div>
    <div className="Heading" style={{ width: "50%" }}>Department</div>
    <div className="Heading">Joining Date</div>
    <div className="Heading">Status</div>
  </div>
  <div className="EmployeeList">
    {employees.map((employee) => {
      return (
        <EmployeeTableCard key={employee._id} employee={employee} />
      );
    })}
  </div>
</div>

    </div>
)}
        </>
    )
}

export default AdminDashboard