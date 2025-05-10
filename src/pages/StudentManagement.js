import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Papa from 'papaparse'; // Import the PapaParse library
import AddStudentForm from './AddStudentModal'; 
import EditStudentForm from './EditStudentModal'; 
import '../css/StudentManagement.css'; 

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editStudentId, setEditStudentId] = useState(null); 

  const token = localStorage.getItem('token');

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:8080/students', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setStudents(response.data);
      setFilteredStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    const filtered = students.filter((student) =>
      student.firstName.toLowerCase().includes(event.target.value.toLowerCase()) ||
      student.lastName.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setFilteredStudents(filtered);
  };

  const handleCsvUpload = (event) => {
    setCsvFile(event.target.files[0]);
  };

  const handleAddStudent = () => {
    setShowAddForm(true);
  };

  const handleStudentAdded = () => {
    setShowAddForm(false);
    fetchStudents();
  };

  const handleEditStudent = (student) => {
    setEditStudentId(student.id); 
  };

  const handleStudentUpdated = () => {
    setEditStudentId(null);
    fetchStudents();
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      await axios.delete(`http://localhost:8080/students/${studentId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchStudents();
    } catch (error) {
        
      alert('Student deletion failed');
      console.error('Error deleting student:', error);
    }
  };

  function convertDateFormat(dateString) {
    const [day, month, year] = dateString.split('-');
    return `${year}-${month}-${day}`;
}


  const handleBulkUpload = async () => {
    if (!csvFile) {
      alert("Please upload a CSV file.");
      return;
    }
  
    const token = localStorage.getItem('token');
  
    Papa.parse(csvFile, {
      header: true, 
      skipEmptyLines: true,
      complete: async (result) => {
        const studentsData = result.data;
        for (const student of studentsData) {
            student.dateOfBirth = convertDateFormat(student.dateOfBirth);
            
          const studentPayload = {
            
            userName: student.username,
            email: student.email,
            password: student.password,
            firstName: student.firstName,
            lastName: student.lastName,
            address: student.address,
            studentClass: student.studentClass,
            dateOfBirth: student.dateOfBirth,
          };
  
          
  
          try {
            await axios.post('http://localhost:8080/students', studentPayload, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
          } catch (error) {
            console.error('Error adding student:', error);
          }
        }
  
        
        fetchStudents(); // 👈 refresh students list
      },
      error: (error) => {
        console.error('Error parsing CSV:', error);
      }
    });
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="student-management">
      <h1 className="header">Student Management</h1>

      <div className="buttons-container">
        <button className="button add-button" onClick={handleAddStudent}>Add Student</button>
        <input
          type="file"
          accept=".csv"
          onChange={handleCsvUpload}
          className="csv-upload"
        />
        <button className="button upload-button" onClick={handleBulkUpload}>
          Upload CSV
        </button>
      </div>

      <div className="search-container">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          className="search-input"
          placeholder="Search by Name"
        />
      </div>

      <h2 className="table-title">Student List</h2>
      <table className="students-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Class</th>
            <th>Date of Birth</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <tr key={student.id}>
                <td>{student.id}</td>
                <td>{`${student.firstName} ${student.lastName}`}</td>
                <td>{student.email}</td>
                <td>{student.studentClass}</td>
                <td>{student.dateOfBirth}</td>
                <td>{student.address}</td>
                <td className="actions">
                  <button className="button edit-button" onClick={() => handleEditStudent(student)}>Edit</button>
                  <button className="button delete-button" onClick={() => handleDeleteStudent(student.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No students found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Show Add Form */}
      {showAddForm && <AddStudentForm onClose={() => setShowAddForm(false)} onStudentAdded={handleStudentAdded} />}
      
      {/* Show Edit Form */}
      {editStudentId && <EditStudentForm studentId={editStudentId} onClose={() => setEditStudentId(null)} onStudentUpdated={handleStudentUpdated} />}
    </div>
  );
}

export default StudentManagement;
