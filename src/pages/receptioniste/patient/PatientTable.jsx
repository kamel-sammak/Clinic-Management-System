import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, ListGroup, Pagination, Table } from "react-bootstrap";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeIcon from "@mui/icons-material/Mode";
import DeleteIcon from "@mui/icons-material/Delete";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { AddCircle } from "@material-ui/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  getPatients,
  updatePatients,
  deletePatients,
  addAppointment,
  getDetails,
  getDoctorAppointment,
  updateDetails,
} from "../../../config/axios/http-config";
import PopupModal from "./PopupModal";

function PatientTable() {
  const [patient, setPatient] = useState([]);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [phones, setPhones] = useState([]);
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [department, setDepartment] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [diagnosis, setDiagnosis] = useState("");
  const [medicin, setMedicin] = useState("");
  const [patientDetails, setPatientDetails] = useState(null);

  const totalPages = Math.ceil(patient.length / usersPerPage);
  const clearFields = () => {
    setFirstName("");
    setLastName("");
    setPatientName("");
    setPhone("");
    setLocation("");
    setAge("");
    setGender("");
    setDoctorName("");
    setDepartment("");
    setAppointmentDate("");
  };

  const deletePatient = (userId) => {
    const authConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("role")}`,
      },
    };
    axios
      .delete(`${deletePatients}${userId}`, authConfig)
      .then((response) => {
        console.log("User deleted successfully");
      })
      .catch((error) => {
        console.log("Error deleting user:", error);
      });
  };

  // Update User
  const handleSubmit = (userId) => {
    console.log("test");

    const updatedUser = {
      firstName: firstName,
      lastName: lastName,
      patientName: patientName,
      email: patientEmail,
      phones,
      location: location,
      gender,
      age,
    };

    if (validateForm(updatedUser)) {
      const authConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("role")}`,
        },
      };

      axios
        .put(`${updatePatients}${userId}`, updatedUser, authConfig)
        .then((response) => {
          console.log("Reception updated successfully");
        })
        .catch((error) => {
          console.log("Error updating Reception:", error);
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

    if (!user.patientName.trim()) {
      errors.patientName = "reception Name is required";
      isValid = false;
    }
    if (!user.email.trim()) {
      errors.patientEmail = "Reception Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      errors.patientEmail = "Invalid Email address";
      isValid = false;
    }

    if (!user.location.trim()) {
      errors.location = "location is required";
      isValid = false;
    }
    if (!user.gender.trim()) {
      errors.gender = "gender is required";
      isValid = false;
    }
    if (!user.age.trim()) {
      errors.age = "age is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const openDetailsPopup = (user) => {
    setSelectedPatient(user);
    setShowDetailsPopup(true);
  };

  const openEditPopup = (user) => {
    setSelectedPatient(user);
    setShowEditPopup(true);
  };

  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedPatient(null);
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
    setSelectedPatient(null);
  };

  const openAddPopup = (user) => {
    setSelectedPatient(user);
    setShowAddPopup(true);
  };

  const closeAddPopup = () => {
    setShowAddPopup(false);
    setSelectedPatient(null);
  };

  const handleAddAppointment = (userId) => {
    const dateObject = new Date(selectedDate);
    const appointmentData = {
      doctorName: doctorName,
      date: dateObject,
    };

    const authConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("role")}`,
      },
    };

    axios
      .post(`${addAppointment}${userId}`, appointmentData, authConfig)
      .then((response) => {
        console.log("Appointment added successfully");
      })
      .catch((error) => {
        console.log("Error adding appointment:", error);
      });
    setShowAddPopup(false);
  };

  // Add Multiple Phone Number
  const addPhone = () => {
    if (phone.trim()) {
      setPhones((prevPhones) => [...prevPhones, phone.trim()]);
      setPhone(""); // Clear the input field after adding a phone number
    }
  };

  // Pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentPatients = patient.slice(indexOfFirstUser, indexOfLastUser);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const getTotalUsers = async () => {
      const authConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("role")}`,
        },
      };
      try {
        const response = await axios.get(getPatients, authConfig);
        setPatient(response.data.reverse());
      } catch (error) {
        console.log(error);
      }
    };
    getTotalUsers();
  }, [patient]);

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
            <th>Patient Name</th>
            <th>Phone</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {currentPatients.map((element) => (
            <tr key={element._id}>
              <td>{element.firstName}</td>
              <td>{element.lastName}</td>
              <td>{element.patientName}</td>
              <td>{element.phones[0]}</td>
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
                  onClick={() => deletePatient(element._id)}
                  color="error"
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>

                <IconButton
                  title="Add AppointmentTable"
                  onClick={() => openAddPopup(element)}
                >
                  <AddCircle style={{ color: "green" }} />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>

        <Modal show={showAddPopup} onHide={closeAddPopup}>
          <Modal.Header closeButton>
            <Modal.Title>Add Appointment for Patient</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPatient && (
              <div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="doctorName">
                    Doctor Name:
                  </label>
                  <input
                    type="text"
                    id="doctorName"
                    className="form-control form-control-lg"
                    onChange={(e) => setDoctorName(e.target.value)}
                  />
                  {formErrors.doctorName && (
                    <div className="invalid-feedback">
                      {formErrors.doctorName}
                    </div>
                  )}
                </div>

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
              className="btn btn-light"
              onClick={() => handleAddAppointment(selectedPatient._id)}
            >
              Save Changes
            </button>
          </Modal.Footer>
        </Modal>

        <Modal show={showDetailsPopup} onHide={closeDetailsPopup}>
          <Modal.Header closeButton>
            <Modal.Title>Patient Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPatient && (
              <Card>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>First Name:</strong> {selectedPatient.firstName}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Last Name:</strong> {selectedPatient.lastName}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Doctor Name:</strong>{" "}
                      {selectedPatient.patientName}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Location:</strong> {selectedPatient.location}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Gender:</strong> {selectedPatient.gender}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Phones:</strong>
                      <ul>
                        {selectedPatient.phones.map((phone, index) => (
                          <li key={index}>{phone}</li>
                        ))}
                      </ul>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Age:</strong> {selectedPatient.age}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Diagnosis:</strong> {selectedPatient.diagnosis}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Required Medications:</strong>{" "}
                      {selectedPatient.required_medications}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            )}
          </Modal.Body>
        </Modal>

        <Modal show={showEditPopup} onHide={closeEditPopup}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Patient</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPatient && <p>Patient ID :{selectedPatient._id}</p>}
            {selectedPatient && (
              <div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="firstName">
                    First Name: {selectedPatient.firstName}
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
                    Last Name: {selectedPatient.lastName}
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
                  <label className="form-label" htmlFor="receptionName">
                    Patient Name: {selectedPatient.patientName}
                  </label>
                  <input
                    type="text"
                    id="receptionName"
                    className={`form-control form-control-lg ${
                      formErrors.patientName ? "is-invalid" : ""
                    }`}
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                  />
                  {formErrors.patientName && (
                    <div className="invalid-feedback">
                      {formErrors.patientName}
                    </div>
                  )}
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="patientEmail">
                    Patient Email: {selectedPatient.email}
                  </label>
                  <input
                    type="email"
                    id="patientEmail"
                    className={`form-control form-control-lg ${
                      formErrors.patientEmail ? "is-invalid" : ""
                    }`}
                    value={patientEmail}
                    onChange={(e) => setPatientEmail(e.target.value)}
                  />
                  {formErrors.patientEmail && (
                    <div className="invalid-feedback">
                      {formErrors.patientEmail}
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
                    Location: {selectedPatient.location}
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
                    Age: {selectedPatient.age}
                  </label>
                  <input
                    type="text"
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
                    Gender: {selectedPatient.gender}
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
              onClick={() => handleSubmit(selectedPatient._id)}
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

export default PatientTable;
