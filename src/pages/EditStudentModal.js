import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/AddStudentModal.css'; // Reuse same CSS

function EditStudentModal({ studentId, onClose, onStudentUpdated }) {
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

  useEffect(() => {
    // Fetch the existing student data
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/students/${studentId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const studentData = response.data;

        // Only pick required fields
        setFormData({
          userName: studentData.userName || '',
          email: studentData.email || '',
          password: '', // Password usually not returned for security, so leave it empty
          firstName: studentData.firstName || '',
          lastName: studentData.lastName || '',
          address: studentData.address || '',
          studentClass: studentData.studentClass || '',
          dateOfBirth: studentData.dateOfBirth || ''
        });

      } catch (error) {
        console.error('Error fetching student:', error);
        alert('Failed to fetch student details.');
        onClose();
      }
    };

    fetchStudent();
  }, [studentId, token, onClose]);

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
      await axios.put(`http://localhost:8080/students/${studentId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onStudentUpdated(); // Refresh the list
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student.');
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
        <h2>Edit Student</h2>
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
            <button type="submit" className="button add-button">Update Student</button>
            <button type="button" className="button cancel-button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditStudentModal;
