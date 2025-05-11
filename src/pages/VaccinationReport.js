import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import { autoTable } from "jspdf-autotable";
import "../css/VaccinationReport.css";

jsPDF.autoTable = autoTable;

const VaccinationReport = () => {
  const [filteredReport, setFilteredReport] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [vaccineFilter, setVaccineFilter] = useState("");
  const [classFilter, setClassFilter] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("");

  const fetchReport = async (page = 0) => {
    try {
      const token = localStorage.getItem("token");

      const params = {
        page: page,
        size: itemsPerPage,
      };
      if (vaccineFilter) params.vaccineName = vaccineFilter;
      if (classFilter) params.studentClass = classFilter;

      const response = await axios.get("http://localhost:8082/vaccinations/report", {
        headers: { Authorization: `Bearer ${token}` },
        params: params,
      });

      setFilteredReport(response.data);
      setCurrentPage(page + 1);
    } catch (error) {
      console.error("Error fetching vaccination report:", error);
    }
  };

  useEffect(() => {
    fetchReport(0);
  }, []);

  const applyFilters = () => {
    fetchReport(0);
  };

  const handleNext = () => {
    fetchReport(currentPage); // currentPage is 1-based
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      fetchReport(currentPage - 2); // backend expects 0-based
    }
  };

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
    const columnWidths = [25, 25, 20, 40, 25, 25, 25];
    let y = startY;

    doc.setFont("helvetica", "bold");
    let x = startX;
    headers.forEach((header, i) => {
      doc.text(header, x, y);
      x += columnWidths[i];
    });

    doc.setFont("helvetica", "normal");
    y += rowHeight;

    data.forEach(row => {
      x = startX;
      row.forEach((cell, i) => {
        const text = typeof cell === "string" ? cell.substring(0, 20) : "";
        doc.text(text, x, y);
        x += columnWidths[i];
      });
      y += rowHeight;
      if (y > 280) {
        doc.addPage();
        y = startY + rowHeight;
      }
    });

    doc.save("vaccination_report.pdf");
  };

  const handleDownload = () => {
    if (selectedFormat === "csv") downloadCSV();
    else if (selectedFormat === "excel") downloadExcel();
    else if (selectedFormat === "pdf") downloadPDF();
    else alert("Please select a format before downloading.");
  };

  return (
    <div className="vaccination-report-container">
      <h2 className="vaccination-report-title">Vaccination Report</h2>

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
          {filteredReport.length > 0 ? (
            filteredReport.map((item, index) => (
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

        <div className="pagination-controls">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="pagination-page-info">
            Page {currentPage}
          </span>
          <button
            onClick={handleNext}
            disabled={filteredReport.length < itemsPerPage}
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
