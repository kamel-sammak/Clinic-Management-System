import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import { getReceptionInfo } from "../../config/axios/http-config";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function PopupModal() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const navigate = useNavigate();

  const handleShow = () => {
    // navigate("myInfo");
    setShow(true);
  };
  const [info, setInfo] = useState("");

  useEffect(() => {
    const getInfo = (userId) => {
      const authConfig = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("role")}`,
        },
      };
      axios
        .get(`${getReceptionInfo}${userId}`, authConfig)
        .then((response) => {
          setInfo(response.data);
          console.log(info);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getInfo();
  });

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        Show My Info
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-outline mb-4">
            <label className="form-label" htmlFor="firstName">
              First Name
            </label>
          </div>
          <div className="form-outline mb-4">
            <label className="form-label" htmlFor="lastName">
              Last Name
            </label>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PopupModal;
