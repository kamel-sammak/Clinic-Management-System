import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { addReception } from "../../../config/axios/http-config";
import axios from "axios";

const genderOptions = ["Male", "Female"];

function PopupModal() {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    receptionName: "",
    email: "",
    password: "",
    phones: [],
    location: "",
    age: "",
    gender: "",
  });
  const [errors, setErrors] = useState({});

  const handleClose = () => {
    setShow(false);
    setFormData({
      firstName: "",
      lastName: "",
      receptionName: "",
      email: "",
      password: "",
      phones: [],
      location: "",
      age: "",
      gender: "",
    });
    setErrors({});
  };

  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setErrors({
      ...errors,
      [e.target.name]: null,
    });
  };

  const handlePhoneChange = (index, e) => {
    const newPhones = [...formData.phones];
    newPhones[index] = e.target.value;
    setFormData({
      ...formData,
      phones: newPhones,
    });
  };

  const handleAddPhone = () => {
    setFormData({
      ...formData,
      phones: [...formData.phones, ""],
    });
  };

  const handleRemovePhone = (index) => {
    const newPhones = [...formData.phones];
    newPhones.splice(index, 1);
    setFormData({
      ...formData,
      phones: newPhones,
    });
  };

  const validateForm = () => {
    let hasErrors = false;
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
      hasErrors = true;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
      hasErrors = true;
    }

    if (!formData.receptionName.trim()) {
      newErrors.receptionName = "Reception Name is required";
      hasErrors = true;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Reception Email is required";
      hasErrors = true;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Invalid email address";
      hasErrors = true;
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      hasErrors = true;
    }

    if (formData.phones.some((phone) => !phone.trim())) {
      newErrors.phones = "Phone is required for each number";
      hasErrors = true;
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
      hasErrors = true;
    }

    if (!formData.age.trim()) {
      newErrors.age = "Age is required";
      hasErrors = true;
    }

    if (!formData.gender.trim()) {
      newErrors.gender = "Gender is required";
      hasErrors = true;
    }

    setErrors(newErrors);
    return !hasErrors;
  };

  const isValidEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddUser = async () => {
    if (validateForm()) {
      try {
        const response = await axios.post(addReception, formData);
        console.log(response);
        handleClose();
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Add Reception
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Reception</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                isInvalid={!!errors.firstName}
              />
              {errors.firstName && (
                <Form.Control.Feedback type="invalid">
                  {errors.firstName}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                isInvalid={!!errors.lastName}
              />
              {errors.lastName && (
                <Form.Control.Feedback type="invalid">
                  {errors.lastName}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="receptionName">
              <Form.Label>Reception Name</Form.Label>
              <Form.Control
                type="text"
                name="receptionName"
                value={formData.receptionName}
                onChange={handleChange}
                isInvalid={!!errors.receptionName}
              />
              {errors.receptionName && (
                <Form.Control.Feedback type="invalid">
                  {errors.receptionName}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Reception Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              {errors.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />
              {errors.password && (
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="phones">
              <Form.Label>Phone Numbers</Form.Label>
              {formData.phones.map((phone, index) => (
                <div key={index} className="d-flex">
                  <Form.Control
                    type="text"
                    name={`phones[${index}]`}
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e)}
                    isInvalid={!!errors.phones}
                  />
                  {index > 0 && (
                    <Button
                      variant="danger"
                      className="ml-2"
                      onClick={() => handleRemovePhone(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="secondary"
                className="mt-2"
                onClick={handleAddPhone}
              >
                Add Phone
              </Button>
              {errors.phones && (
                <Form.Control.Feedback type="invalid">
                  {errors.phones}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="location">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                isInvalid={!!errors.location}
              />
              {errors.location && (
                <Form.Control.Feedback type="invalid">
                  {errors.location}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="age">
              <Form.Label>Age</Form.Label>
              <Form.Control
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                isInvalid={!!errors.age}
              />
              {errors.age && (
                <Form.Control.Feedback type="invalid">
                  {errors.age}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="gender">
              <Form.Label>Gender</Form.Label>
              <Form.Control
                as="select"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                isInvalid={!!errors.gender}
              >
                <option value="">Select Gender</option>
                {genderOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Control>
              {errors.gender && (
                <Form.Control.Feedback type="invalid">
                  {errors.gender}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddUser}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PopupModal;
