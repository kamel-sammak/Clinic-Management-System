import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, ListGroup, Table } from "react-bootstrap";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeIcon from "@mui/icons-material/Mode";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getDetails,
  getDoctorAppointment,
  updateDetails,
} from "../../../config/axios/http-config";
import Pagination from "react-bootstrap/Pagination";

function DoctorAppointment() {
  const [appointments, setAllAppointments] = useState([]);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [medicin, setMedicin] = useState("");
  const [patientDetails, setPatientDetails] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const totalPages = Math.ceil(appointments.length / usersPerPage);

  const handleSubmit = (appointmentId) => {
    console.log(appointmentId);
    const updatedDiagnosis = {
      diagnosis,
      required_medications: medicin,
    };

    const authConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("role")}`,
      },
    };

    axios
      .put(`${updateDetails}${appointmentId}`, updatedDiagnosis, authConfig)
      .then((response) => {
        console.log("Details updated successfully");
        console.log(response);
      })
      .catch((error) => {
        console.log("Error updating Details:", error);
      });

    setShowEditPopup(false);
  };

  const openDetailsPopup = async (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsPopup(true);
    const patientName = appointment.patient._id;
    try {
      const response = await axios.get(`${getDetails}${patientName}`);
      setPatientDetails(response.data);
    } catch (error) {
      console.log("Error fetching patient details:", error);
    }
  };

  const openEditPopup = (appointment) => {
    setSelectedAppointment(appointment);
    setShowEditPopup(true);
  };

  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedAppointment(null);
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
    setSelectedAppointment(null);
  };

  const getAppointments = async () => {
    const authConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("role")}`,
      },
    };
    const name = localStorage.getItem("name");
    try {
      const response = await axios.get(
        `${getDoctorAppointment}${name}`,
        authConfig
      );
      setAllAppointments(response.data.reverse());
    } catch (error) {
      console.log(error);
    }
  };

  // const getPatientDetails = async (userId) => {
  //   const authConfig = {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("role")}`,
  //     },
  //   };
  //   try {
  //     const response = await axios.get(`${getDetails}${userId}`, authConfig);
  //     setAllAppointments(response.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentAppointments = appointments.slice(
    indexOfFirstUser,
    indexOfLastUser
  );
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    getAppointments();
  }, []);

  return (
    <>
      <Table striped bordered hover style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {currentAppointments.map((element) => (
            <tr key={element._id}>
              <td>{element.patient && element.patient.patientName}</td>
              <td>{element.doctor}</td>
              <td>{new Date(element.date).toLocaleString()}</td>
              <td>
                <IconButton
                  title="View"
                  onClick={() => openDetailsPopup(element)}
                  color="primary"
                  aria-label="details"
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  title="Edit"
                  onClick={() => openEditPopup(element)}
                  color="primary"
                  aria-label="details"
                >
                  <ModeIcon />
                </IconButton>
              </td>
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

      <Modal show={showDetailsPopup} onHide={closeDetailsPopup}>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <Card>
              <Card.Body>
                <Card.Title>Appointment Details</Card.Title>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Patient:</strong>{" "}
                    {selectedAppointment.patient &&
                      selectedAppointment.patient.patientName}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Doctor:</strong> {selectedAppointment.doctor}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Date:</strong>{" "}
                    {new Date(selectedAppointment.date).toLocaleString()}
                  </ListGroup.Item>

                  {patientDetails && (
                    <>
                      <Card.Title style={{ paddingTop: 15 }}>
                        Patient Details
                      </Card.Title>
                      <ListGroup.Item>
                        <strong>First Name:</strong> {patientDetails.firstName}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Last Name:</strong> {patientDetails.lastName}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Gender:</strong> {patientDetails.gender}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Diagnosis:</strong> {patientDetails.diagnosis}
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <strong>Required Medications:</strong>{" "}
                        {patientDetails.required_medications}
                      </ListGroup.Item>
                    </>
                  )}
                </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showEditPopup} onHide={closeEditPopup}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Patient Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && <p>Patient ID: {selectedAppointment._id}</p>}
          {selectedAppointment && (
            <div>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="patient">
                  Diagnosis : {selectedAppointment.diagnosis}
                </label>
                <input
                  type="text"
                  id="patient"
                  className="form-control form-control-lg"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                />
              </div>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="doctor">
                  Required Medications:
                </label>
                <input
                  type="text"
                  id="doctor"
                  className="form-control form-control-lg"
                  value={medicin}
                  onChange={(e) => setMedicin(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary btn-lg btn-block"
                type="submit"
                onClick={() =>
                  handleSubmit(
                    selectedAppointment.patient &&
                      selectedAppointment.patient._id
                  )
                }
              >
                Submit
              </button>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default DoctorAppointment;
