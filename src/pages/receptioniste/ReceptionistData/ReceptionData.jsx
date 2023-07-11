import React, { useState, useEffect } from "react";
import {
  getReceptionInfo,
  updateReceptionInfo,
} from "../../../config/axios/http-config";
import axios from "axios";
import { Table } from "react-bootstrap";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeIcon from "@mui/icons-material/Mode";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, ListGroup } from "react-bootstrap";

function ReceptionData() {
  const [info, setInfo] = useState([]);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [receptionName, setReceptionName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [phone, setPhone] = useState("");
  const [phones, setPhones] = useState([]);
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const clearFields = () => {
    setFirstName("");
    setLastName("");
    setReceptionName("");
    setEmail("");
    setSpecialty("");
    setPassword("");
    setPhone("");
    setLocation("");
    setAge("");
    setGender("");
  };

  const handleSubmit = (userId) => {
    const updatedDetails = {
      firstName: firstName,
      lastName: lastName,
      receptionName: receptionName,
      email: email,
      password: password,
      phones,
      location: location,
      specialty: specialty,
      gender,
      age,
    };

    if (validateForm(updatedDetails)) {
      const authConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("role")}`,
        },
      };
      axios
        .put(`${updateReceptionInfo}${userId}`, updatedDetails, authConfig)
        .then((response) => {
          console.log("User updated successfully");
        })
        .catch((error) => {
          console.log("Error updating user:", error);
        });

      setShowEditPopup(false);
      clearFields();
    }
  };

  // Form Validation
  const validateForm = () => {
    let errors = {};
    let isValid = true;

    if (!firstName.trim()) {
      errors.firstName = "First Name is required";
      isValid = false;
    }

    if (!lastName.trim()) {
      errors.lastName = "Last Name is required";
      isValid = false;
    }

    if (!receptionName.trim()) {
      errors.receptionName = "reception Name is required";
      isValid = false;
    }

    if (!email.trim()) {
      errors.email = "reception Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid Email address";
      isValid = false;
    }
    if (!password.trim()) {
      errors.password = "password is required";
      isValid = false;
    }

    if (!location.trim()) {
      errors.location = "location is required";
      isValid = false;
    }
    if (!age.trim()) {
      errors.age = "age is required";
      isValid = false;
    }
    if (!gender.trim()) {
      errors.gender = "gender is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const openDetailsPopup = (user) => {
    setSelectedUser(user);
    setShowDetailsPopup(true);
  };

  const openEditPopup = (user) => {
    setSelectedUser(user);
    setShowEditPopup(true);
  };

  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedUser(null);
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
    setSelectedUser(null);
  };

  // Add Multiple Phone Number
  const addPhone = () => {
    if (phone.trim()) {
      setPhones((prevPhones) => [...prevPhones, phone.trim()]);
      setPhone(""); // Clear the input field after adding a phone number
    }
  };

  useEffect(() => {
    const getDoctorInfos = async () => {
      const authConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("role")}`,
        },
      };
      const id = localStorage.getItem("_id");
      try {
        const response = await axios.get(
          `${getReceptionInfo}${id}`,
          authConfig
        );
        setInfo(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getDoctorInfos();
  }, [info]);

  return (
    <>
      <Table striped bordered hover style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>My Name</th>
            <th>My Email</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {info && (
            <tr key={info._id}>
              <td>{info.firstName}</td>
              <td>{info.lastName}</td>
              <td>{info.receptionName}</td>
              <td>{info.email}</td>
              <td>
                <IconButton
                  title="View"
                  onClick={() => openDetailsPopup(info)}
                  color="primary"
                  aria-label="details"
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  title="Edit"
                  onClick={() => openEditPopup(info)}
                  color="primary"
                  aria-label="edit"
                >
                  <ModeIcon />
                </IconButton>
              </td>
            </tr>
          )}
        </tbody>

        <Modal show={showDetailsPopup} onHide={closeDetailsPopup}>
          <Modal.Header closeButton>
            <Modal.Title>Receptionist Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <Card>
                <Card.Body>
                  <Card.Title>Reception Details</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>First Name:</strong> {selectedUser.firstName}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Last Name:</strong> {selectedUser.lastName}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>My Name:</strong> {selectedUser.receptionName}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>My Email:</strong> {selectedUser.email}
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
            <Modal.Title>Edit User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && (
              <div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="firstName">
                    First Name : {selectedUser.firstName}
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
                  <label className="form-label" htmlFor="receptionName">
                    My Name: {selectedUser.receptionName}
                  </label>
                  <input
                    type="text"
                    id="receptionName"
                    className={`form-control form-control-lg ${
                      formErrors.receptionName ? "is-invalid" : ""
                    }`}
                    value={receptionName}
                    onChange={(e) => setReceptionName(e.target.value)}
                  />
                  {formErrors.receptionName && (
                    <div className="invalid-feedback">
                      {formErrors.receptionName}
                    </div>
                  )}
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="doctorEmail">
                    My Email: {selectedUser.email}
                  </label>
                  <input
                    type="email"
                    id="ReceptionEmail"
                    className={`form-control form-control-lg ${
                      formErrors.email ? "is-invalid" : ""
                    }`}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {formErrors.email && (
                    <div className="invalid-feedback">{formErrors.email}</div>
                  )}
                </div>
                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="password">
                    Password: {selectedUser.password}
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
    </>
  );
}

export default ReceptionData;
