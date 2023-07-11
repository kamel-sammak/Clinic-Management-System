import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { addDepartment } from "../../../config/axios/http-config";
import axios from "axios";

function PopupModal() {
  const [show, setShow] = useState(false);
  const [section, setSection] = useState("");
  const [description, setDescription] = useState("");
  const [doctors, setDoctors] = useState("");
  const [errors, setErrors] = useState({});

  const handleClose = () => {
    setShow(false);
    // Reset form fields and errors on modal close
    setSection("");
    setDescription("");
    setDoctors("");
    setErrors({});
  };

  const handleShow = () => setShow(true);

  const handleAddUser = async () => {
    // Validate form inputs before submitting
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(addDepartment, {
        section,
        description,
        doctorName: doctors,
      });
      console.log(response);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const validateForm = () => {
    const errors = {};

    if (!section.trim()) {
      errors.section = "Section is required";
    }

    if (!description.trim()) {
      errors.description = "Description is required";
    }

    if (!doctors.trim()) {
      errors.doctors = "Doctors is required";
    }

    return errors;
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Add Department
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-outline mb-4">
            <label className="form-label" htmlFor="section">
              Section
            </label>
            <input
              type="text"
              id="section"
              className={`form-control form-control-lg ${
                errors.section ? "is-invalid" : ""
              }`}
              value={section}
              onChange={(e) => setSection(e.target.value)}
            />
            {errors.section && (
              <div className="invalid-feedback">{errors.section}</div>
            )}
          </div>
          <div className="form-outline mb-4">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <input
              type="text"
              id="description"
              className={`form-control form-control-lg ${
                errors.description ? "is-invalid" : ""
              }`}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <div className="invalid-feedback">{errors.description}</div>
            )}
          </div>
          <div className="form-outline mb-4">
            <label className="form-label" htmlFor="doctors">
              Doctors
            </label>
            <input
              type="text"
              id="doctors"
              className={`form-control form-control-lg ${
                errors.doctors ? "is-invalid" : ""
              }`}
              value={doctors}
              onChange={(e) => setDoctors(e.target.value)}
            />
            {errors.doctors && (
              <div className="invalid-feedback">{errors.doctors}</div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleAddUser}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PopupModal;
