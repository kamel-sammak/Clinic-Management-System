import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, ListGroup, Table } from "react-bootstrap";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeIcon from "@mui/icons-material/Mode";
import DeleteIcon from "@mui/icons-material/Delete";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  deleteReception,
  getReception,
  updateReception,
} from "../../../config/axios/http-config";
import PopupModal from "./PopupModal";
import Pagination from "react-bootstrap/Pagination";

function ReceptionTable() {
  const [users, setAllUsers] = useState([]);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [receptionName, setReceptionName] = useState("");
  const [receptionEmail, setReceptionEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [phones, setPhones] = useState([]);
  const [location, setLocation] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const totalPages = Math.ceil(users.length / usersPerPage);
  const clearFields = () => {
    setFirstName("");
    setLastName("");
    setReceptionName("");
    setReceptionEmail("");
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
        .delete(`${deleteReception}${userId}`, authConfig)
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
    const updatedUser = {
      firstName: firstName,
      lastName: lastName,
      receptionName: receptionName,
      email: receptionEmail,
      password: password,
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
        .put(`${updateReception}${userId}`, updatedUser, authConfig)
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

    if (!user.receptionName.trim()) {
      errors.receptionName = "Reception Name is required";
      isValid = false;
    }

    if (!user.email.trim()) {
      errors.receptionEmail = "Reception Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(user.email)) {
      errors.receptionEmail = "Invalid Email address";
      isValid = false;
    }

    if (!user.password.trim()) {
      errors.password = "Password is required";
      isValid = false;
    }

    if (!user.location.trim()) {
      errors.location = "Location is required";
      isValid = false;
    }

    if (!user.age.trim()) {
      errors.age = "Age is required";
      isValid = false;
    }

    if (!user.gender.trim()) {
      errors.gender = "Gender is required";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  // Show Details PopUp
  const handleShowDetailsPopup = (user) => {
    setSelectedUser(user);
    setShowDetailsPopup(true);
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
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Getting All Receptionists
  useEffect(() => {
    const getTotalUsers = async () => {
      const authConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("role")}`,
        },
      };
      try {
        const response = await axios.get(getReception, authConfig);
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
            <th>Reception Name</th>
            <th>Reception Email</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((element) => (
            <tr key={element._id}>
              <td>{element.firstName}</td>
              <td>{element.lastName}</td>
              <td>{element.receptionName}</td>
              <td>{element.email}</td>
              <td>
                <IconButton
                  title="View"
                  onClick={() => handleShowDetailsPopup(element)}
                  color="primary"
                  aria-label="details"
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  title="Edit"
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

        <Modal show={showDetailsPopup} onHide={closeDetailsPopup}>
          <Modal.Header closeButton>
            <Modal.Title>Reception Details</Modal.Title>
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
                      <strong>Reception Name:</strong>{" "}
                      {selectedUser.receptionName}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Doctor Email:</strong> {selectedUser.email}
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
            <Modal.Title>Edit Reception</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedUser && <p>{selectedUser._id}</p>}
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
                    Reception Name: {selectedUser.receptionName}
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
                  <label className="form-label" htmlFor="receptionEmail">
                    Reception Email: {selectedUser.email}
                  </label>
                  <input
                    type="email"
                    id="receptionEmail"
                    className={`form-control form-control-lg ${
                      formErrors.receptionEmail ? "is-invalid" : ""
                    }`}
                    value={receptionEmail}
                    onChange={(e) => setReceptionEmail(e.target.value)}
                  />
                  {formErrors.receptionEmail && (
                    <div className="invalid-feedback">
                      {formErrors.receptionEmail}
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

export default ReceptionTable;
