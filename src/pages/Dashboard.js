import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Dashboard() {
  const navigate = useNavigate();
  const [vaccinationData, setVaccinationData] = useState(null);
  const [upcomingVaccinations, setUpcomingVaccinations] = useState([]);

  useEffect(() => {
    const fetchVaccinationSummary = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8082/vaccinations/summary', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setVaccinationData(response.data);
      } catch (error) {
        console.error('Error fetching vaccination summary:', error);
      }
    };

    const fetchUpcomingVaccinations = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:8082/vaccinations?upcomingOnly=true', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUpcomingVaccinations(response.data);
      } catch (error) {
        console.error('Error fetching upcoming vaccinations:', error);
      }
    };

    fetchVaccinationSummary();
    fetchUpcomingVaccinations();
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>

      <div className="container">
        <button className="nav-button" onClick={() => navigate('/students')}>Student Management</button>
        <button className="nav-button" onClick={() => navigate('/vaccinations')}>Vaccination Management</button>
        <button className="nav-button" onClick={() => navigate('/reports')}>Reports</button>
      </div>

      {/* Vaccination Summary Box */}
      <div className="summary-box">
        <h2>Vaccination Summary</h2>
        {vaccinationData ? (
          <div>
            <p>Total Students Assigned: <strong>{vaccinationData.totalAssignedStudents}</strong></p>
            <p>Vaccinated Students: <strong>{vaccinationData.totalVaccinatedStudents}</strong></p>
            <p>Pending Vaccinations: <strong>{vaccinationData.totalAssignedStudents - vaccinationData.totalVaccinatedStudents}</strong></p>
          </div>
        ) : (
          <p>Loading vaccination summary...</p>
        )}
      </div>

      {/* Upcoming Vaccination Drives */}
      <h2>Upcoming Vaccination Drives</h2>
      <table className="vaccination-table">
        <thead>
          <tr>
            <th>Vaccine Name</th>
            <th>Drive Date</th>
            <th>Available Doses</th>
            <th>Applicable Classes</th>
          </tr>
        </thead>
        <tbody>
          {upcomingVaccinations.length > 0 ? (
            upcomingVaccinations.map((vaccination) => (
              <tr key={vaccination.id}>
                <td>{vaccination.vaccineName}</td>
                <td>{vaccination.driveDate}</td>
                <td>{vaccination.availableDoses}</td>
                <td>{vaccination.applicableClasses}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No upcoming vaccination drives.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
