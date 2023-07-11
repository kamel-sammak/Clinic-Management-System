import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAppointments } from "../../../config/axios/http-config";
import Pagination from "react-bootstrap/Pagination";

function AppointmentsTable() {
  const [appointment, setAllAppointments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const totalPages = Math.ceil(appointment.length / usersPerPage);

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentAppointments = appointment.slice(
    indexOfFirstUser,
    indexOfLastUser
  );
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const getAllAppointments = async () => {
      const authConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("role")}`,
        },
      };
      try {
        const response = await axios.get(getAppointments, authConfig);
        setAllAppointments(response.data.reverse());
      } catch (error) {
        console.log(error);
      }
    };
    getAllAppointments();
  }, [appointment]);

  return (
    <>
      <Table striped bordered hover style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Patient</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {currentAppointments.map((element) => (
            <tr key={element._id}>
              <td>{element.doctorName}</td>
              <td>{element.patientName && element.patientName.patientName}</td>
              <td>{new Date(element.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Pagination>
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === currentPage}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      </div>
    </>
  );
}

export default AppointmentsTable;
