import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

function Receptioniste() {
  const navigate = useNavigate();
  const navigateToShowInfo = () => {
    navigate("myInfo");
  };

  const navigateToPatientTable = () => {
    navigate("patient");
  };

  const navigateToAppointmentTable = () => {
    navigate("appointments");
  };

  // const navigateToAppointmentsTable = () => {
  //   navigate("appointments");
  // };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: " center",
          paddingTop: 20,
        }}
      >
        <Button
          onClick={navigateToShowInfo}
          style={{ marginLeft: 20, marginRight: 20 }}
        >
          Show My Info
        </Button>
        <Button
          onClick={navigateToPatientTable}
          style={{ marginLeft: 20, marginRight: 20 }}
        >
          Patients
        </Button>
        <Button
          onClick={navigateToAppointmentTable}
          style={{ marginLeft: 20, marginRight: 20 }}
        >
          Appointments
        </Button>
      </div>
      {/*<Button onClick={navigateToAppointmentsTable}>Appointments</Button> */}
    </>
  );
}

export default Receptioniste;
