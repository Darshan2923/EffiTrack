import React from 'react'
import { useNavigate } from 'react-router-dom';
import moment from 'moment'


const EmployeeTableCard = ({employee}) => {
    const navigate=useNavigate();
    // generate color for avatar
    const generateColor=(name)=>{
        const hashName=name
        ?.toLowerCase()
        .split("")
        .reduce((hash,char)=>{
            const charCode=char.charCodeAt(0);
            return (((hash%65536)*65536)%2147483648)+charCode;
    },0);
    const hue=hashName%360;
    const saturation=75;
    const lightness=40;
    return `hsl(${hue},${saturation}%,${lightness}%)`;
    };
  return (
    <div className="Card" onClick={handleCardClick}>
      <div className="Info" style={{ width: "30%" }}>
        <div
          className="AvatarImage"
          style={{ background: generateColor(employee?.username) }}
        >
          {employee?.username[0]}
        </div>
      </div>
      <div className="Name">
        <b>{employee?.username}</b>
        <span>{employee?.email}</span>
      </div>
      <div className="Info">{employee?.contact_number}</div>
      <div className="Info" style={{ width: "50%" }}>{employee?.department}</div>
      <div className="Info">{moment(employee?.joining_date).format("DD-MM-YYYY")}</div>
      <div className="Info">
        {employee?.active ? (
          <div
            className="Status"
            style={{
              background: `${green + 10}`,
              color: `${green}`
            }}
          >
            Active
          </div>
        ) : (
          <div
            className="Status"
            style={{
              background: `${yellow + 10}`,
              color: `${yellow}`
            }}
          >
            Deactivated
          </div>
        )}
      </div>
    </div>
  )
}

export default EmployeeTableCard
