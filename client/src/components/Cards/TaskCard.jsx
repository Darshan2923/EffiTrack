import moment from "moment";
import { useSelector } from "react-redux";

const TaskCard = ({ task, setOpenUpdateTask }) => {
  const { role } = useSelector((state) => state.user);

  return (
    <div
      className={`bg-${task.task_type}-100 border rounded-lg border-dashed p-4 shadow-md w-full max-w-xs md:max-w-md cursor-pointer font-light transition duration-500 ease-in-out hover:shadow-xl transform hover:scale-102`}
      onClick={() => {
        if (role === "employee") {
          setOpenUpdateTask({
            state: true,
            task,
          });
        }
      }}
    >
      <div className="flex items-center gap-2 text-sm pb-2">
        {task.task_type === "meeting" && (
          <VideocamOutlined className="text-base" />
        )}
        {task.task_type === "break" && (
          <RamenDiningOutlined className="text-base" />
        )}
        {task.task_type === "work" && (
          <LaptopOutlined className="text-base" />
        )}
        <div className={`bg-${task.task_type}-200 text-${task.task_type} rounded-md px-2 py-1 font-medium`}>
          {task?.task_type?.charAt(0).toUpperCase() + task.task_type.slice(1)}
        </div>
      </div>
      <div className="text-base text-left font-light pb-2">{task.task_description}</div>
      <div className="flex items-center gap-14 text-sm text-gray-600 font-medium">
        <div className="flex items-center gap-2">
          <AccessTimeOutlined className="text-base" />
          {task.time_taken}&nbsp;min
        </div>
        <div className="flex items-center gap-2">
          <DateRangeOutlined className="text-base" />
          {moment(task.start_time).format("DD MMM YYYY")}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
