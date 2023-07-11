import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

function Doctor() {
  const navigate = useNavigate();

  const navigateToDoctorInfo = () => {
    navigate("myInfo");
  };

  const navigateToDoctorAppointment = () => {
    navigate("doctorAppointment");
  };
  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          paddingTop: 20,
        }}
      >
        <Button
          onClick={navigateToDoctorInfo}
          style={{ marginLeft: 20, marginRight: 20 }}
        >
          Doctor Info
        </Button>
        <Button
          onClick={navigateToDoctorAppointment}
          style={{ marginRight: 20 }}
        >
          Doctor Appointments
        </Button>
      </div>
    </div>
  );
}

export default Doctor;
