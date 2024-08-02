import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { openSnackbar } from '../redux/reducers/snackbarSlice'
import EmployeeTableCard from './Cards/EmployeeTableCard'
import { getAllEmployees } from '../api'


const AdminDashboard = () => {
    const { currentUser, reload } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const token = localStorage.getItem("trackify-token");
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch employees
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                await getAllEmployees(token).then((res) => {
                    setEmployees(res.data.employees);
                    print(employees)
                    setLoading(false);
                })
            } catch (err) {
                setError(err.message);
                setLoading(false);
                if (err.response) {
                    setLoading(false);
                    setError(err.response.data.message);
                } else {
                    setLoading(false);
                    dispatch(
                        openSnackbar({
                            message: err.message,
                            severity: "error"
                        })
                    );
                }
            }
        };
        fetchEmployees();
    }, [token, currentUser, dispatch, reload])

    return (
        <div>
            {loading || error ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <div className="p-5 pb-[200px] h-full overflow-y-scroll flex flex-col gap-5 bg-background">
                        <div className="text-text_primary font-medium mb-4 text-[20px] sm:text-[16px]">
                            Employee List
                        </div>
                        <div className="w-full flex flex-col gap-px rounded-md overflow-hidden shadow-md transition-all duration-500 ease-in-out">
                            <div className="flex items-center p-5 bg-table_header text-white gap-3 sm:p-4 sm:gap-2 transition-all duration-500 ease-in-out">
                                <div className="w-1/3 text-center text-sm sm:text-base"> </div>
                                <div className="w-4/5 flex justify-start text-sm sm:text-base">Username</div>
                                <div className="text-sm sm:text-base">Contact No</div>
                                <div className="w-1/2 text-sm sm:text-base">Department</div>
                                <div className="text-sm sm:text-base">Joining Date</div>
                                <div className="text-sm sm:text-base">Status</div>
                            </div>
                            <div className="flex flex-col gap-px bg-text_secondary_20">
                                {employees.map((employee) => (
                                    <EmployeeTableCard key={employee._id} employee={employee} />
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            )}
        </div>
    )
}

export default AdminDashboard