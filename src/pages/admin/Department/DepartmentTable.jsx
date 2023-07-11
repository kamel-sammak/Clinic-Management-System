import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, ListGroup, Table } from "react-bootstrap";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModeIcon from "@mui/icons-material/Mode";
import DeleteIcon from "@mui/icons-material/Delete";
import { Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Pagination from "react-bootstrap/Pagination";

import {
  deleteDepartment,
  getDepartments,
  updateDepartment,
} from "../../../config/axios/http-config";
import PopupModal from "./PopupModal";

function DepartmentTable() {
  const [departments, setDepartments] = useState([]);
  const [showDetailsPopup, setShowDetailsPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [section, setSection] = useState("");
  const [description, setDescription] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const totalPages = Math.ceil(departments.length / itemsPerPage);

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
        .delete(`${deleteDepartment}${userId}`, authConfig)
        .then((response) => {
          console.log("Department deleted successfully");
          window.alert("User deleted successfully");
        })
        .catch((error) => {
          console.log("Error deleting department:", error);
        });
    }
  };

  const handleSubmit = (id) => {
    const updatedDepartment = {
      section,
      description,
    };

    const authConfig = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("role")}`,
      },
    };

    axios
      .put(`${updateDepartment}${id}`, updatedDepartment, authConfig)
      .then((response) => {
        console.log("Department updated successfully");
      })
      .catch((error) => {
        console.log("Error updating department:", error);
      });

    setShowEditPopup(false);
  };

  const openDetailsPopup = (department) => {
    setSelectedDepartment(department);
    setShowDetailsPopup(true);
  };

  const openEditPopup = (department) => {
    setSelectedDepartment(department);
    setShowEditPopup(true);
  };

  const closeDetailsPopup = () => {
    setShowDetailsPopup(false);
    setSelectedDepartment(null);
  };

  const closeEditPopup = () => {
    setShowEditPopup(false);
    setSelectedDepartment(null);
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      const authConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("role")}`,
        },
      };
      try {
        const response = await axios.get(getDepartments, authConfig);
        setDepartments(response.data.reverse());
      } catch (error) {
        console.log(error);
      }
    };
    fetchDepartments();
  }, [departments]);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = departments.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div style={{ marginTop: 20, marginLeft: 20 }}>
        <PopupModal />
      </div>
      <Table striped bordered hover style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Section</th>
            <th>Description</th>
            <th>Doctors</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((department) => (
            <tr key={department._id}>
              <td>{department.section}</td>
              <td>{department.description}</td>
              <td>{department.doctorName}</td>
              <td>
                <IconButton
                  title="View"
                  onClick={() => openDetailsPopup(department)}
                  color="primary"
                  aria-label="details"
                >
                  <VisibilityIcon />
                </IconButton>
                <IconButton
                  title="Edit"
                  onClick={() => openEditPopup(department)}
                  color="primary"
                  aria-label="edit"
                >
                  <ModeIcon />
                </IconButton>
                <IconButton
                  onClick={() => deleteUser(department._id)}
                  color="error"
                  aria-label="delete"
                >
                  <DeleteIcon />
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
          <Modal.Title>Department Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDepartment && (
            <Card>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item>
                    <strong>Section Name: </strong>
                    {selectedDepartment.section}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Description: </strong>
                    {selectedDepartment.description}
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <strong>Doctors: </strong>
                    {selectedDepartment.doctorName}
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
      </Modal>

      <Modal show={showEditPopup} onHide={closeEditPopup}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDepartment && (
            <div>
              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="section">
                  Department Name: {selectedDepartment.section}
                </label>
                <input
                  type="text"
                  id="section"
                  className="form-control form-control-lg"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                />
              </div>

              <div className="form-outline mb-4">
                <label className="form-label" htmlFor="description">
                  Department Description: {selectedDepartment.section}
                </label>
                <input
                  type="text"
                  id="description"
                  className="form-control form-control-lg"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary btn-lg btn-block"
                type="submit"
                onClick={() => handleSubmit(selectedDepartment._id)}
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

export default DepartmentTable;
