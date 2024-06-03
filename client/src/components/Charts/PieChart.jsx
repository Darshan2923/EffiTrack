import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import DatePicker from 'react-datepicker';
import { useEffect, useState } from 'react';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ tasks, showType }) => {
    const [customDate, setCustomDate] = useState(null);
    const [title, setTitle] = useState(
        showType === "today" ? "Today's" : "Yesterday's"
    );
    const [data, setData] = useState();
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const [filter, setFilter] = useState([
        showType === "today" ? today : yesterday
    ]);

    const handleFilter = (e) => {
        const { value } = e.target;
        if (value === "Yesterday") {
            setTitle("Yesterday's");
            setFilter([yesterday]);
            setCustomDate(null);
        } else if (value === "All") {
            setTitle("All");
            setFilter([]);
            setCustomDate(null);
        } else if (value == "Last 7 Days") {
            setTitle("Last 7 Day's");
            const lastWeekStart = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - 6
            );
            setFilter([lastWeekStart, today]);
            setCustomDate(null);
        } else if (value === "This Week") {
            setTitle("This Week's");
            const thisWeekStart = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - today.getDay()
            );
            const thisWeekEnd = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate() - today.getDay() + 6
            );
            setFilter([thisWeekStart, thisWeekEnd]);
            setCustomDate(null);
        } else if (value === "This Month") {
            setTitle("This Month's");
            const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
            const thisMonthEnd = new Date(
                today.getFullYear(),
                today.getMonth() + 1,
                0
            );
            setFilter([thisMonthStart, thisMonthEnd]);
            setCustomDate(null);
        } else if (value === "This Year") {
            setTitle("This Year's");
            const thisYearStart = new Date(today.getFullYear(), 0, 1);
            const thisYearEnd = new Date(today.getFullYear(), 11, 31);
            setFilter([thisYearStart, thisYearEnd]);
            setCustomDate(null);
        } else if (value === "Custom") {
            setTitle("Custom Date");
            setCustomDate(new Date());
            setFilter([]);
        }
    };

    useEffect(() => {
        const filteredTasks = tasks.filter((task) => {
            const taskStartTime = new Date(task.start_time);
            if (filter.length === 0) {
                if (customDate) {
                    const customDateObj = new Date(customDate);
                    return (
                        taskStartTime.getDate() === customDateObj.getDate() &&
                        taskStartTime.getMonth() === customDateObj.getMonth() &&
                        taskStartTime.getFullYear() === customDateObj.getFullYear()
                    );
                }
                return true;
            }
            if (filter.length === 2 && filter[0] && filter[1]) {
                return taskStartTime >= filter[0] && taskStartTime <= filter[1];
            }
            if (filter.length === 1 && filter[0]) {
                return (
                    taskStartTime.getDate() === filter[0].getDate() &&
                    taskStartTime.getMonth() === filter[0].getMonth() &&
                    taskStartTime.getFullYear() === filter[0].getFullYear()
                );
            }
            return false;
        });

        function calculateTime(type) {
            let sum = 0;

            for (let i = 0; i < filteredTasks; i++) {
                if (filteredTasks[i].task_type === type) {
                    sum += parseFloat(filteredTasks[i].time_taken);
                }
            }

            return sum;
        }

        const taskSums = [
            calculateTime("work"),
            calculateTime("meeting"),
            calculateTime("break")
        ];

        if (taskSums.every((sum) => sum === 0)) {
            setData({
                labels: ["No tasks"],
                datasets: [
                    {
                        label: "No tasks found",
                        data: [1],
                        backgroundColor: black,
                        hoverOffset: 4,
                        rotation: 0
                    }]
            });
        } else {
            setData({
                labels: ["Work", "Meeting", "Break"],
                datasets: [{
                    label: "Total time(minutes)",
                    data: taskSums,
                    backgroundColor: black,
                    hoverOffset: 8,
                    rotation: 0
                }]
            });
        }

    }, [filter, customDate, tasks]);

    const options = { maintainAspectRatio: true };

    return (
        <div className="w-full max-w-300 flex flex-col items-center gap-14 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-18">
            <div className="w-full flex items-center justify-between text-base font-medium text-gray-700 dark:text-gray-300">
                {title} Tasks
            </div>
            {data && <Pie data={data} className="m-12" options={options} />}
            {showType !== "today" && (
                <div className="flex items-center gap-10 text-sm font-medium border border-gray-300 dark:border-gray-700 rounded-md text-gray-700 dark:text-gray-300 py-6 px-12">
                    <div className="text-gray-600 dark:text-gray-400">Filter Tasks:</div>
                    <select
                        onChange={(e) => handleFilter(e)}
                        className="text-sm font-medium bg-transparent border-none outline-none focus:outline-none appearance-none"
                    >
                        <option value="Yesterday">Yesterday</option>
                        <option value="All">All</option>
                        <option value="Last 7 Days">Last 7 Days</option>
                        <option value="This Week">This Week</option>
                        <option value="This Month">This Month</option>
                        <option value="This Year">This Year</option>
                        <option value="Custom">Custom -</option>
                    </select>
                    {customDate && (
                        <div className="w-32 flex items-center justify-center bg-gray-100 dark:bg-gray-700 py-2 px-4 rounded cursor-pointer">
                            <DatePicker
                                selected={customDate}
                                onChange={(date) => {
                                    setCustomDate(date);
                                }}
                                placeholderText="Start Date"
                                maxDate={new Date()}
                                dateFormat="dd MMM yyyy"
                                showYearDropdown
                                scrollableYearDropdown
                                className="text-sm font-medium bg-transparent border-none outline-none focus:outline-none appearance-none"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>

    )
}

export default PieChart