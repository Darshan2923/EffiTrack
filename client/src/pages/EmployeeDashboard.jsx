import React, { useEffect, useState } from 'react'
import { getAllEmployees } from '../api/apiList';
import {ToastContainer,toast} from 'react-toastify'
import Masonry,{ResponsiveMasonry} from 'react-responsive-masonry'

const EmployeeDashboard = ({setOpenCreateTask}) => {
    // Hooks
    const navigate=useNavigate();
    const token=localStorage.getItem("effitrack-token");
    const [tasks,setTasks]=useState([]);
    const [openUpdateTask,setopenUpdateTask]=useState({
        state:false,
        task:null
    });
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState(null);

    // Utils
    const today=new Date(); //Get today's date
    const yesterday=new Date(today); //Create  a new Date
    yesterday.setDate(today.getDate()-1);

    // Fetch employees
    useEffect(()=>{
        const fetchEmployees=async()=>{
            try {
                await getAllEmployees(token).then((res)=>{
                    setTasks(res.data,tasks);
                    setLoading(false);
                });                
            } catch (error) {
                setError(err.message);
                setLoading(false);
                if (err.response) {
                  setLoading(false);
                  setError(err.response.data.message);
                } else {
                  setLoading(false);
                toast.error("An error occured");
            }}
        }
        fetchEmployees();
    },[token]);

    return (
        <div className="p-5 pb-40 flex flex-col gap-5 overflow-y-auto">
        {loading || error ? (
          <>
            {loading && <Loader />}
            {error && (
              <div className="w-full h-2/3 flex items-center justify-center gap-2 text-lg font-medium text-red-600">
                Error: {error}
              </div>
            )}
          </>
        ) : (
          <div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-8">
                <div className="w-full">
                  <div className="flex items-center justify-between font-medium text-xl text-gray-800 mb-4">
                    Todays Tasks
                    {tasks.filter(task => {
                      const taskStartDate = new Date(task.start_time);
                      return (
                        taskStartDate.getDate() === new Date().getDate() &&
                        taskStartDate.getMonth() === new Date().getMonth() &&
                        taskStartDate.getFullYear() === new Date().getFullYear()
                      );
                    }).length === 0 ? (
                      <div className="w-full h-2/3 flex items-center justify-center gap-2 text-lg font-medium text-red-600">
                        No tasks found !!
                        <div className="text-primary text-sm cursor-pointer transition duration-200 ease-in-out hover:text-primary-dark" onClick={() => setOpenCreateTask(true)}>
                          Add Task
                        </div>
                      </div>
                    ) : (
                      <ResponsiveMasonry columnsCountBreakPoints={{ 400: 1, 700: 2, 1000: 3 }} className="mb-8">
                        <Masonry gutter="12px">
                          {tasks
                            .filter(task => {
                              const taskStartDate = new Date(task.start_time);
                              return (
                                taskStartDate.getDate() === new Date().getDate() &&
                                taskStartDate.getMonth() === new Date().getMonth() &&
                                taskStartDate.getFullYear() === new Date().getFullYear()
                              );
                            })
                            .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
                            .map(task => (
                              <TaskCard key={task._id} task={task} setOpenUpdateTask={setOpenUpdateTask} />
                            ))}
                        </Masonry>
                      </ResponsiveMasonry>
                    )}
                  </div>
                </div>
                <div className="w-full">
                  <div className="flex items-center justify-between font-medium text-xl text-gray-800 mb-4">
                    Recent Tasks
                    <div className="text-primary text-sm cursor-pointer transition duration-200 ease-in-out hover:text-primary-dark" onClick={() => navigate("/tasks")}>
                      View All
                    </div>
                  </div>
                  {tasks.slice(0, 8).length === 0 ? (
                    <div className="w-full h-2/3 flex items-center justify-center gap-2 text-lg font-medium text-red-600">
                      No tasks found !!
                      <div className="text-primary text-sm cursor-pointer transition duration-200 ease-in-out hover:text-primary-dark" onClick={() => setOpenCreateTask(true)}>
                        Add Task
                      </div>
                    </div>
                  ) : (
                    <ResponsiveMasonry columnsCountBreakPoints={{ 400: 1, 700: 2, 1000: 3 }} className="mb-8">
                      <Masonry gutter="12px">
                        {tasks
                          .slice(0, 8)
                          .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))
                          .map(task => (
                            <TaskCard key={task._id} task={task} setOpenUpdateTask={setOpenUpdateTask} />
                          ))}
                      </Masonry>
                    </ResponsiveMasonry>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-8">
                <div className="font-medium text-xl text-gray-800">Pie Chart</div>
                <div className="flex gap-8">
                  <PieChart showType="today" tasks={tasks} />
                  <PieChart showType="yesterday" tasks={tasks} />
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="font-medium text-xl text-gray-800">Weekly Chart</div>
              <div className="flex justify-center">
                <BarChartComponent tasks={tasks} />
              </div>
            </div>
          </div>
        )}
        {openUpdateTask.state && (
          <UpdateTask setOpenUpdateTask={setOpenUpdateTask} task={openUpdateTask.task} />
        )}
      </div>
    )
}

export default EmployeeDashboard