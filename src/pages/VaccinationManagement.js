import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/VaccinationManagement.css";
import Modal from "../components/Modal";

const VaccinationManagement = () => {
  const [vaccinationDrives, setVaccinationDrives] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDrive, setNewDrive] = useState({
    vaccineName: "",
    driveDate: "",
    availableDoses: 0,
    applicableClasses: "",
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingDriveId, setEditingDriveId] = useState(null);

  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [vaccinationStats, setVaccinationStats] = useState({
    totalAssignedStudents: 0,
    totalVaccinatedStudents: 0,
    vaccinationPercentage: 0.0,
  });

  // New state for Mark as Vaccinated modal
  const [isMarkModalOpen, setIsMarkModalOpen] = useState(false);
  const [assignedStudents, setAssignedStudents] = useState([]);
  const [selectedDriveId, setSelectedDriveId] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  useEffect(() => {
    fetchDrives();
  }, []);

  const fetchDrives = () => {
    const token = localStorage.getItem("token");
    axios
      .get("http://localhost:8082/vaccinations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setVaccinationDrives(response.data))
      .catch((error) => {
        alert(error.response.data);
        console.error("Error fetching drives:", error);
      });
  };

  const handleScheduleNewDrive = () => {
    setIsEditMode(false);
    setNewDrive({
      vaccineName: "",
      driveDate: "",
      availableDoses: 0,
      applicableClasses: "",
    });
    setIsModalOpen(true);
  };

  const handleEditDrive = (drive) => {
    setIsEditMode(true);
    setEditingDriveId(drive.id);
    setNewDrive({
      vaccineName: drive.vaccineName,
      driveDate: drive.driveDate,
      availableDoses: drive.availableDoses,
      applicableClasses: drive.applicableClasses.replace(/[\[\]']+/g, ""),
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDrive((prevDrive) => ({ ...prevDrive, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const request = isEditMode
      ? axios.put(`http://localhost:8082/vaccinations/${editingDriveId}`, newDrive, {
          headers: { Authorization: `Bearer ${token}` },
        })
      : axios.post("http://localhost:8082/vaccinations", newDrive, {
          headers: { Authorization: `Bearer ${token}` },
        });

    request
      .then(() => {
        fetchDrives();
        setIsModalOpen(false);
      })
      .catch((error) => {
        alert(error.response.data);
        console.error("Error saving drive:", error.response?.data?.message || error);
      });
  };

  const handleStatsClick = (driveId) => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:8082/vaccinations/summary?vaccineId=${driveId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setVaccinationStats(response.data);
        setIsStatsModalOpen(true);
      })
      .catch((error) => {
        alert(error.response.data);
        console.error("Error fetching stats:", error);
      });
  };

  const handleMarkVaccinatedClick = (driveId) => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://localhost:8082/vaccinations/assigned/${driveId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAssignedStudents(response.data);
        setSelectedDriveId(driveId);
        setSelectedStudentId(null);
        setIsMarkModalOpen(true);
      })
      .catch((error) => {
        alert(error.response.data);
        console.error("Error fetching assigned students:", error);
      });
  };

  const handleMarkAsVaccinated = () => {
    if (!selectedStudentId) {
      alert("Please select a student.");
      return;
    }

    const token = localStorage.getItem("token");
    axios
      .patch(
        "http://localhost:8082/vaccinations/mark-vaccinated",
        {
          studentId: selectedStudentId,
          driveId: selectedDriveId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("Student marked as vaccinated.");
        setIsMarkModalOpen(false);
        fetchDrives();
      })
      .catch((error) => {
        alert(error.response.data);
        console.error("Error marking as vaccinated:", error);
      });
  };

  return (
    <div className="vaccination-management">
      <h1 className="header">Vaccination Management</h1>

      <button className="button schedule-button" onClick={handleScheduleNewDrive}>
        Schedule New Drive
      </button>

      <table className="vaccination-table">
        <thead>
          <tr>
            <th>Vaccine Name</th>
            <th>Drive Date</th>
            <th>Available Doses</th>
            <th>Applicable Classes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vaccinationDrives.map((drive) => (
            <tr key={drive.id}>
              <td>{drive.vaccineName}</td>
              <td>{drive.driveDate}</td>
              <td>{drive.availableDoses}</td>
              <td>{drive.applicableClasses}</td>
              <td>
                <button className="button edit-button" onClick={() => handleEditDrive(drive)}>
                  Edit
                </button>
                <button className="button stats-button" onClick={() => handleStatsClick(drive.id)}>
                  Stats
                </button>
                <button
                  className="button delete-button"
                  onClick={() => handleMarkVaccinatedClick(drive.id)}
                >
                  Mark Student as Vaccinated
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && (
        <Modal>
          <div className="modal-content">
            <h2>{isEditMode ? "Edit Vaccination Drive" : "Create Vaccination Drive"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Vaccine Name:</label>
                <input
                  type="text"
                  name="vaccineName"
                  value={newDrive.vaccineName}
                  onChange={handleInputChange}
                  required
                  disabled={isEditMode}
                />
              </div>
              <div className="form-group">
                <label>Drive Date:</label>
                <input
                  type="date"
                  name="driveDate"
                  value={newDrive.driveDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Available Doses:</label>
                <input
                  type="number"
                  name="availableDoses"
                  value={newDrive.availableDoses}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Applicable Classes:</label>
                <input
                  type="text"
                  name="applicableClasses"
                  value={newDrive.applicableClasses}
                  onChange={handleInputChange}
                  required
                  disabled={isEditMode}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="button schedule-button">
                  Submit
                </button>
                <button
                  type="button"
                  className="button cancel-button"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {isStatsModalOpen && (
        <Modal>
          <div className="modal-content">
            <h2>Vaccination Drive Stats</h2>
            <p>
              <strong>Total Assigned Students:</strong> {vaccinationStats.totalAssignedStudents}
            </p>
            <p>
              <strong>Total Vaccinated Students:</strong> {vaccinationStats.totalVaccinatedStudents}
            </p>
            <p>
              <strong>Vaccination Percentage:</strong> {vaccinationStats.vaccinationPercentage}%
            </p>
            <div className="form-actions">
              <button
                className="button cancel-button"
                onClick={() => setIsStatsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {isMarkModalOpen && (
        <Modal>
          <div className="modal-content">
            <h4>Select Student to Mark as Vaccinated</h4>
            <div className="form-group">
            <select
            value={selectedStudentId || ""}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            >
  <option value="">-- Select Student --</option>
  {assignedStudents.map((student) => (
    <option key={student.id} value={student.id}>
      {student.firstName} {student.lastName} 
    </option>
  ))}
</select>

            </div>
            <div className="form-actions">
              <button className="button schedule-button" onClick={handleMarkAsVaccinated}>
                Mark as Vaccinated
              </button>
              <button
                className="button cancel-button"
                onClick={() => setIsMarkModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default VaccinationManagement;
