import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pagination, Table } from "react-bootstrap";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeIcon from "@mui/icons-material/Mode";
import DeleteIcon from "@mui/icons-material/Delete";
import { Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  deleteAppintment,
  getAppointments,
  updateAppointment,
} from "../../../config/axios/http-config";

function AppointmentTable() {
  const [appointments, setAllAppointments] = useState([]);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [patient, setPatient] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [date, setDate] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const totalPages = Math.ceil(appointments.length / usersPerPage);
  const clearFields = () => {
    setPatient("");
    setDoctorName("");
    setDate("");
  };

  const deleteAppointment = (appointmentId) => {
    const authConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("role")}`,
      },
    };
    axios
      .delete(`${deleteAppintment}${appointmentId}`, authConfig)
      .then((response) => {
        console.log("Appointment deleted successfully");
      })
      .catch((error) => {
        console.log("Error deleting Appointment:", error);
      });
  };

  const handleSubmit = (appointmentId) => {
    const dateObject = new Date(selectedDate);
    const updatedAppointment = {
      date: dateObject,
    };
    const authConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("role")}`,
      },
    };

    axios
      .put(
        `${updateAppointment}${appointmentId}`,
        updatedAppointment,
        authConfig
      )
      .then((response) => {
        console.log("Appointment updated successfully");
      })
      .catch((error) => {
        console.log("Error updating Appointment:", error);
      });

    setShowEditPopup(false);
    clearFields();
  };

  // Form Validation
  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!patient.trim()) {
      errors.patient = "patient Name is required";
      isValid = false;
    }

    if (!doctorName.trim()) {
      errors.doctor = "doctor Name is required";
      isValid = false;
    }

    if (!date.trim()) {
      errors.date = "date is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const openDetailsPopup = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsPopup(true);
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
  }, [appointments]);

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
              <td>{element.patientName && element.patientName.patientName}</td>
              <td>{element.doctorName}</td>
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
                  aria-label="edit"
                >
                  <ModeIcon />
                </IconButton>
                <IconButton
                  onClick={() => deleteAppointment(element.appointmentId)}
                  color="error"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>

        <Modal show={showDetailsPopup} onHide={closeDetailsPopup}>
          <Modal.Header closeButton>
            <Modal.Title>Appointment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAppointment && (
              <div>
                <p>Patient: {selectedAppointment.patientName.patientName}</p>
                <p>Doctor: {selectedAppointment.doctorName}</p>
                <p>
                  Date: {new Date(selectedAppointment.date).toLocaleString()}
                </p>
              </div>
            )}
          </Modal.Body>
        </Modal>

        <Modal show={showEditPopup} onHide={closeEditPopup}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Apointment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAppointment && <p>{selectedAppointment._id}</p>}
            {selectedAppointment && (
              <div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="appointmentDate">
                    Appointment Date and Time:
                  </label>
                  <br />
                  <DatePicker
                    id="appointmentDate"
                    className="form-control form-control-lg"
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                  {formErrors.appointmentDate && (
                    <div className="invalid-feedback">
                      {formErrors.appointmentDate}
                    </div>
                  )}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-primary btn-lg btn-block"
              type="submit"
              onClick={() => handleSubmit(selectedAppointment.appointmentId)}
            >
              Submit
            </button>
          </Modal.Footer>
        </Modal>
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

export default AppointmentTable;
