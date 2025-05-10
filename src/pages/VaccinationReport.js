import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { autoTable } from 'jspdf-autotable';
import '../css/VaccinationReport.css';  // Import the CSS file
jsPDF.autoTable = autoTable;
const VaccinationReport = () => {
  const [report, setReport] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter states
  const [vaccineFilter, setVaccineFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('');  // To store selected download format

  useEffect(() => {
    fetchReport();
  }, []);

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8082/vaccinations/report", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReport(response.data);
      setFilteredReport(response.data);
    } catch (error) {
      console.error("Error fetching vaccination report:", error);
    }
  };

  // Apply filters
  const applyFilters = () => {
    let filteredData = [...report];
    
    if (vaccineFilter) {
      filteredData = filteredData.filter(item =>
        item.vaccineName.toLowerCase().includes(vaccineFilter.toLowerCase())
      );
    }

    if (classFilter) {
      filteredData = filteredData.filter(item =>
        item.studentClass.toLowerCase().includes(classFilter.toLowerCase())
      );
    }

    setFilteredReport(filteredData);
    setCurrentPage(1); // Reset to first page when filters are applied
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReport.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReport.length / itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  // Convert filtered report data to CSV format
  const downloadCSV = () => {
    const headers = [
      "First Name", "Last Name", "Class", "Email", "Vaccine", "Status", "Date"
    ];
    const rows = filteredReport.map(item => [
      item.firstName,
      item.lastName,
      item.studentClass,
      item.email,
      item.vaccineName,
      item.vaccinationStatus,
      item.vaccinationDate,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    const link = document.createElement("a");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = "vaccination_report.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Convert filtered report data to Excel format
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredReport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vaccination Report");
    XLSX.writeFile(wb, "vaccination_report.xlsx");
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(8);
    const headers = ["First Name", "Last Name", "Class", "Email", "Vaccine", "Status", "Date"];
    
    const data = filteredReport.map(item => [
      item.firstName || "",
      item.lastName || "",
      item.studentClass || "",
      item.email || "",
      item.vaccineName || "",
      item.vaccinationStatus || "",
      item.vaccinationDate || "",
    ]);
  
    const startX = 10;
    const startY = 20;
    const rowHeight = 10;
  
    const columnWidths = [25, 25, 20, 40, 25, 25, 25]; // make sure they fit within 180 total
  
    let y = startY;
  
    // Draw headers
    doc.setFont("helvetica", "bold");
    let x = startX;
    headers.forEach((header, i) => {
      doc.text(header, x, y);
      x += columnWidths[i];
    });
  
    // Draw rows
    doc.setFont("helvetica", "normal");
    y += rowHeight;
  
    data.forEach(row => {
      x = startX;
      row.forEach((cell, i) => {
        const text = typeof cell === "string" ? cell.substring(0, 20) : ""; // trim long text
        doc.text(text, x, y);
        x += columnWidths[i];
      });
      y += rowHeight;
  
      // Move to next page if content overflows
      if (y > 280) {
        doc.addPage();
        y = startY + rowHeight;
      }
    });
  
    doc.save("vaccination_report.pdf");
  };
  
  
  

  // Handle format selection and download
  const handleDownload = () => {
    if (selectedFormat === "csv") {
      downloadCSV();
    } else if (selectedFormat === "excel") {
      downloadExcel();
    } else if (selectedFormat === "pdf") {
      downloadPDF();
    } else {
      alert("Please select a format before downloading.");
    }
  };

  return (
    <div className="vaccination-report-container">
      <h2 className="vaccination-report-title">Vaccination Report</h2>

      {/* Filter Section */}
      <div className="filters">
        <div className="filter-item">
          <label>Vaccine Name: </label>
          <input
            type="text"
            value={vaccineFilter}
            onChange={(e) => setVaccineFilter(e.target.value)}
            placeholder="Filter by Vaccine"
          />
        </div>
        <div className="filter-item">
          <label>Class: </label>
          <input
            type="text"
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            placeholder="Filter by Class"
          />
        </div>
        <button onClick={applyFilters} className="apply-filters-button">
          Apply Filters
        </button>
      </div>

      <table className="vaccination-report-table">
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Class</th>
            <th>Email</th>
            <th>Vaccine</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.length > 0 ? (
            currentItems.map((item, index) => (
              <tr key={index}>
                <td>{item.firstName}</td>
                <td>{item.lastName}</td>
                <td>{item.studentClass}</td>
                <td>{item.email}</td>
                <td>{item.vaccineName}</td>
                <td>{item.vaccinationStatus}</td>
                <td>{item.vaccinationDate}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="no-data-message">No data available</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Download and Pagination Section */}
      <div className="download-pagination">
        <div className="download-section">
          <label>Download as: </label>
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="download-dropdown"
          >
            <option value="">Select Format</option>
            <option value="csv">CSV</option>
            <option value="excel">Excel</option>
            <option value="pdf">PDF</option>
          </select>
          <button onClick={handleDownload} className="apply-filters-button">
            Download
          </button>
        </div>

        {/* Pagination Controls */}
        <div className="pagination-controls">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="pagination-page-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default VaccinationReport;
