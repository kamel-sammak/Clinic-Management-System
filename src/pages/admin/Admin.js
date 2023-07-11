import React from "react";
import "./Admin.css";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

function Admin() {
  const navigate = useNavigate();
  const navigateToUsersTable = () => {
    navigate("receptionistes");
  };

  const navigateToDoctorTable = () => {
    navigate("doctors");
  };

  const navigateToDepartmentTable = () => {
    navigate("departments");
  };

  const navigateToAppointmentsTable = () => {
    navigate("appointments");
  };

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
          onClick={navigateToUsersTable}
          style={{ marginLeft: 20, marginRight: 20 }}
        >
          Receptionistes
        </Button>
        <Button onClick={navigateToDoctorTable} style={{ marginRight: 20 }}>
          Doctors
        </Button>
        <Button onClick={navigateToDepartmentTable} style={{ marginRight: 20 }}>
          Departments
        </Button>
        <Button onClick={navigateToAppointmentsTable}>Appointments</Button>
      </div>
    </>
  );
}

export default Admin;
