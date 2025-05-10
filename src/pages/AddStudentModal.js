import React, { useState } from 'react';
import axios from 'axios';
import '../css/AddStudentModal.css';

function AddStudentModal({ onClose, onStudentAdded }) {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    address: '',
    studentClass: '',
    dateOfBirth: ''
  });

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (let key in formData) {
      if (!formData[key]) {
        alert(`Please fill the ${key} field`);
        return;
      }
    }

    try {
      await axios.post('http://localhost:8080/students', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onStudentAdded();
      onClose();
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student.');
    }
  };

  const formatLabel = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add New Student</h2>
        <form onSubmit={handleSubmit} className="modal-form">
          {Object.keys(formData).map((key) => (
            <div key={key} className="form-group">
              <label className="form-label" htmlFor={key}>
                {formatLabel(key)}
              </label>
              <input
                type={key === 'password' ? 'password' : key === 'dateOfBirth' ? 'date' : 'text'}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                autoComplete="off"
                id={key}
              />
            </div>
          ))}
          <div className="modal-buttons">
            <button type="submit" className="button add-button">Add Student</button>
            <button type="button" className="button cancel-button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStudentModal;
