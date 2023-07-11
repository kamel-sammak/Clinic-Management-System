import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, ListGroup, Table } from "react-bootstrap";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeIcon from "@mui/icons-material/Mode";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  deleteDoctor,
  getDoctorAppointments,
  getDoctors,
  updateDoctor,
} from "../../../config/axios/http-config";
import PopupModal from "./PopupModal";
import Pagination from "react-bootstrap/Pagination";

function DoctorTable() {
  const [users, setAllUsers] = useState([]);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [phones, setPhones] = useState([]);
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorEmail, setDoctorEmail] = useState("");
  const [doctorSpecialty, setDoctorSpecialty] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [appointment, setAppointment] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  
  const totalPages = Math.ceil(users.length / usersPerPage);
  const clearFields = () => {
    setFirstName("");
    setLastName("");
    setDoctorName("");
    setDoctorEmail("");
    setDoctorSpecialty("");
    setPassword("");
    setPhone("");
    setPhones([]);
    setLocation("");
    setAge("");
    setGender("");
  };

  // Delete User
  const deleteUser = (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?"
    );
    if (confirmed) {
      const authConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("role")}`,
        },
      };
      axios
        .delete(`${deleteDoctor}${userId}`, authConfig)
        .then((response) => {
          console.log("User deleted successfully");
          window.alert("User deleted successfully");
        })
        .catch((error) => {
          console.log("Error deleting user:", error);
        });
    }
  };

  // Update User
  const handleSubmit = (userId) => {
    const updatedDoctor = {
      firstName: firstName,
      lastName: lastName,
      doctorName: doctorName,
      email: doctorEmail,
      password: password,
      phones: phones,
      location: location,
      gender,
      age,
    };
    if (validateForm(updatedDoctor)) {
      const authConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("role")}`,
        },
      };

      axios
        .put(`${updateDoctor}${userId}`, updatedDoctor, authConfig)
        .then((response) => {
          console.log("Doctor updated successfully");
        })
        .catch((error) => {
          console.log("Error updating Doctor:", error);
        });

      setShowEditPopup(false);
      clearFields();
    }
  };

  // Form Validation
  const validateForm = (user) => {
    let errors = {};
    let isValid = true;

    if (!user.firstName.trim()) {
      errors.firstName = "First Name is required";
      isValid = false;
    }

    if (!user.lastName.trim()) {
      errors.lastName = "Last Name is required";
      isValid = false;
    }

    if (!user.doctorName.trim()) {
      errors.doctorName = "Doctor Name is required";
      isValid = false;
    }

    if (!user.email.trim()) {
      errors.doctorEmail = "Doctor Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      errors.doctorEmail = "Invalid Email address";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const getAppointment = (doctorName) => {
    const authConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("role")}`,
      },
    };
    axios
      .get(`${getDoctorAppointments}${doctorName}`, authConfig)
      .then((response) => {
        setAppointment(response.data);
        console.log(appointment);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Show Details PopUp
  const handleShowDetailsPopup = (user) => {
    setSelectedUser(user);
    setShowDetailsPopup(true);
  };

  // Show Appointments PopUp
  const openPopup = (user) => {
    getAppointment(user);
    setShowPopup(true);
  };

  // Show Edit PopUp
  const handleShowEditPopup = (user) => {
    setSelectedUser(user);
    setShowEditPopup(true);
  };

  // Close Details PopUp
  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedUser(null);
  };

  // Close Edit PopUp
  const closeEditPopup = () => {
    clearFields();
    setShowEditPopup(false);
    setSelectedUser(null);
    setFormErrors({});
  };

  // Close Appointments PopUp
  const closePopup = () => {
    setShowPopup(false);
  };

  // Add Multiple Phone Number
  const addPhone = () => {
    if (phone.trim()) {
      setPhones((prevPhones) => [...prevPhones, phone.trim()]);
      setPhone("");
    }
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Getting All Doctors
  useEffect(() => {
    const getTotalUsers = async () => {
      const authConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("role")}`,
        },
      };
      try {
        const response = await axios.get(getDoctors, authConfig);
        setAllUsers(response.data.reverse());
      } catch (error) {
        console.log(error);
      }
    };
    getTotalUsers();
  }, [users]);

  return (
    <>
      <div style={{ marginTop: 20, marginLeft: 20 }}>
        <PopupModal />
      </div>

      <Table striped bordered hover style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Doctor Name</th>
            <th>Doctor Email</th>
            <th>Specialty</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((element) => (
            <tr key={element._id}>
              <td>{element.firstName}</td>
              <td>{element.lastName}</td>
              <td>{element.doctorName}</td>
              <td>{element.email}</td>
              <td>{element.specialty}</td>
              <td>
                <IconButton
                  onClick={() => openPopup(element.doctorName)}
                  color="primary"
                  aria-label="details"
                >
                  <CalendarMonthIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleShowDetailsPopup(element)}
                  color="primary"
                  aria-label="details"
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  onClick={() => handleShowEditPopup(element)}
                  color="primary"
                  aria-label="edit"
                >
                  <ModeIcon />
                </IconButton>
                <IconButton
                  onClick={() => deleteUser(element._id)}
                  color="error"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>

        <Modal show={showPopup} onHide={closePopup}>
          <Modal.Header closeButton>
            <Modal.Title>Doctor Appointments</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {appointment.length > 0 ? (
              <ListGroup>
                {appointment.map((appointments, index) => (
                  <ListGroup.Item key={index}>
                    <p>Patient: {appointments.patient.patientName}</p>
                    <p>
                      Appointment Date:{" "}
                      {new Date(appointments.date).toLocaleString()}
                    </p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="text-center">
                <p>No Appointments For This Doctor</p>
              </div>
            )}
          </Modal.Body>
        </Modal>

        <Modal show={showDetailsPopup} onHide={closeDetailsPopup}>
          <Modal.Header closeButton>
            <Modal.Title>Doctor Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <Card>
                <Card.Body>
                  <Card.Title>Doctor Details</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>First Name:</strong> {selectedUser.firstName}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Last Name:</strong> {selectedUser.lastName}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Doctor Name:</strong> {selectedUser.doctorName}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Doctor Email:</strong> {selectedUser.email}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Doctor Specialty:</strong>{" "}
                      {selectedUser.specialty}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Location:</strong> {selectedUser.location}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Gender:</strong> {selectedUser.gender}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Phones:</strong>
                      <ul>
                        {selectedUser.phones.map((phone, index) => (
                          <li key={index}>{phone}</li>
                        ))}
                      </ul>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Age:</strong> {selectedUser.age}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            )}
          </Modal.Body>
        </Modal>

        <Modal show={showEditPopup} onHide={closeEditPopup}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Doctor</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && <p>Doctor ID: {selectedUser._id}</p>}
            {selectedUser && (
              <div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="firstName">
                    First Name: {selectedUser.firstName}
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className={`form-control form-control-lg ${
                      formErrors.firstName ? "is-invalid" : ""
                    }`}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  {formErrors.firstName && (
                    <div className="invalid-feedback">
                      {formErrors.firstName}
                    </div>
                  )}
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="lastName">
                    Last Name: {selectedUser.lastName}
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className={`form-control form-control-lg ${
                      formErrors.lastName ? "is-invalid" : ""
                    }`}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                  {formErrors.lastName && (
                    <div className="invalid-feedback">
                      {formErrors.lastName}
                    </div>
                  )}
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="doctorName">
                    Doctor Name: {selectedUser.doctorName}
                  </label>
                  <input
                    type="text"
                    id="doctorName"
                    className={`form-control form-control-lg ${
                      formErrors.doctorName ? "is-invalid" : ""
                    }`}
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                  />
                  {formErrors.doctorName && (
                    <div className="invalid-feedback">
                      {formErrors.doctorName}
                    </div>
                  )}
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="doctorEmail">
                    Doctor Email: {selectedUser.email}
                  </label>
                  <input
                    type="email"
                    id="doctorEmail"
                    className={`form-control form-control-lg ${
                      formErrors.doctorEmail ? "is-invalid" : ""
                    }`}
                    value={doctorEmail}
                    onChange={(e) => setDoctorEmail(e.target.value)}
                  />
                  {formErrors.doctorEmail && (
                    <div className="invalid-feedback">
                      {formErrors.doctorEmail}
                    </div>
                  )}
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="doctorSpecialty">
                    Doctor Speciality: {selectedUser.specialty}
                  </label>
                  <input
                    type="text"
                    id="doctorSpecialty"
                    className={`form-control form-control-lg ${
                      formErrors.doctorSpecialty ? "is-invalid" : ""
                    }`}
                    value={doctorSpecialty}
                    onChange={(e) => setDoctorSpecialty(e.target.value)}
                  />
                  {formErrors.doctorSpecialty && (
                    <div className="invalid-feedback">
                      {formErrors.doctorSpecialty}
                    </div>
                  )}
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="password">
                    Password:
                  </label>
                  <input
                    type="password"
                    id="password"
                    className={`form-control form-control-lg ${
                      formErrors.password ? "is-invalid" : ""
                    }`}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {formErrors.password && (
                    <div className="invalid-feedback">
                      {formErrors.password}
                    </div>
                  )}
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="phones">
                    Phones:
                  </label>
                  <ul>
                    {phones.map((phoneNumber, index) => (
                      <li key={index}>{phoneNumber}</li>
                    ))}
                  </ul>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={addPhone}
                    >
                      Add Phone
                    </button>
                  </div>
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="location">
                    Location: {selectedUser.location}
                  </label>
                  <input
                    type="text"
                    id="location"
                    className={`form-control form-control-lg ${
                      formErrors.location ? "is-invalid" : ""
                    }`}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                  {formErrors.location && (
                    <div className="invalid-feedback">
                      {formErrors.location}
                    </div>
                  )}
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="age">
                    Age: {selectedUser.age}
                  </label>
                  <input
                    type="number"
                    id="age"
                    className={`form-control form-control-lg ${
                      formErrors.age ? "is-invalid" : ""
                    }`}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                  {formErrors.age && (
                    <div className="invalid-feedback">{formErrors.age}</div>
                  )}
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="gender">
                    Gender: {selectedUser.gender}
                  </label>
                  <select
                    id="gender"
                    className={`form-control form-control-lg ${
                      formErrors.gender ? "is-invalid" : ""
                    }`}
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  {formErrors.gender && (
                    <div className="invalid-feedback">{formErrors.gender}</div>
                  )}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeEditPopup}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => handleSubmit(selectedUser._id)}
            >
              Save Changes
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

export default DoctorTable;
