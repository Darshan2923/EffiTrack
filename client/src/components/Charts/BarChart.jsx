import moment from "moment";
import {Bar} from 'react-chartjs-2'
import {Chart,registerables} from 'chart.js'
import { useEffect, useState } from "react";

Chart.register(...registerables);

const BarChartComponent=({tasks})=>{
    const [weekDate,setWeekDate]=useState([]);
    const [data,setData]=useState({
        labels:weekDate,
        datasets:[
            {
                label:"Work",
                data:[0,0,0,0,0,0,0],
                backgroundColor:black,
                borderColor:grey,
                borderWidth:1
            },
            {
                label: "Meeting",
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: black,
                borderColor: grey,
                borderWidth: 1
              },
              {
                label: "Break",
                data: [0, 0, 0, 0, 0, 0, 0],
                backgroundColor: black,
                borderColor: grey,
                borderWidth: 1
              }
        ]
    });

    // Set the week days and data
    useEffect(()=>{
        const today=new Date();
        const weekDate=[];
        const tempData={
            labels:weekDate,
            datasets: [
                {
                    label:"Work",
                    data:[0,0,0,0,0,0,0],
                    backgroundColor:black,
                    borderColor:grey,
                    borderWidth:1
                },
                {
                    label: "Meeting",
                    data: [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: black,
                    borderColor: grey,
                    borderWidth: 1
                  },
                  {
                    label: "Break",
                    data: [0, 0, 0, 0, 0, 0, 0],
                    backgroundColor: black,
                    borderColor: grey,
                    borderWidth: 1
                  }
            ]
        };
        for (let i = 0; i < 7; i++) {
            const date=new Date(today);
            date.setDate(date.getDate()-i);
            weekDate.push(
                `${moment(date).format("ddd")} - ${moment(date).format("DD MMM")}`
            );
            
        }

        tasks?.slice().reverse().forEach((task)=>{
            const day= `${moment(task.start_time).format("ddd")} - ${moment(
                task.start_time
              ).format("DD MMM")}`;
              const index=weekDate.findIndex((date)=>date.includes(day));
              if (task.task_type === "work") {
                tempData.datasets[0].data[index] += task.time_taken;
              } else if (task.task_type === "meeting") {
                tempData.datasets[1].data[index] += task.time_taken;
              } else {
                tempData.datasets[2].data[index] += task.time_taken;
              }
        });
        setData({...tempData});
        setWeekDate(weekDate);

    },[tasks]);

    const options={maintainAspectRatio:false};

    return(
<div className="bg-white shadow-md rounded-md p-4">
  <h2 className="text-xl font-medium mb-4">This week Tasks</h2>
  <div className="bg-gray-100 p-4 rounded-md">
    <div className="h-96">
      <Bar data={data} className="w-full h-full" options={options} />
    </div>
  </div>
</div>

    );

}

export default BarChartComponent;
