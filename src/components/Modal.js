import React from "react";
import "../css/Modal.css";

const Modal = ({ children }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-container">
        {children}
      </div>
    </div>
  );
};

export default Modal;
