import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function Admin() {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const tableRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:3001/reports')
      .then(result => setReports(result.data))
      .catch(err => console.error('Error fetching reports:', err));
  }, []);

  const generatePDF = () => {
    const filteredReports = reports.filter(report =>
      report.occasion.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const doc = new jsPDF();

    // Set table headers and data
    const tableHeaders = ['Occasion', 'Head Count', 'Total Cost'];
    const tableRows = filteredReports.map(report => [report.occasion, report.headCount, report.total]);

    // Define starting Y position for table
    let startY = 20;

    // Add table title
    doc.setFontSize(18);
    doc.text('Generated Reports', 14, 15);

    // Create table
    doc.autoTable({
      startY: startY + 10,
      head: [tableHeaders],
      body: tableRows,
      theme: 'grid', // Optional - 'striped', 'grid', 'plain'
      styles: {
        fontSize: 12,
        fontStyle: 'normal',
        textColor: [0, 0, 0],
        cellPadding: 4,
      },
      columnStyles: {
        0: { fontStyle: 'bold' },
      },
      didDrawPage: () => {
        // Save the PDF with a specific name
        doc.save('Order_report.pdf');
      },
    });
  };

  const handleSearchChange = event => {
    setSearchQuery(event.target.value);
  };

  const filteredReports = reports.filter(report =>
    report.occasion.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div> 
      <Navbar />
      <div className="row">
        <div className="leftcolumn">
          <div className="card">
            <h2>SS Wedding Hall</h2>
            <img src="../public/Buffet-Banner.jpg" className="fakeimg" style={{ height: '300px' }} alt="Food Image" />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="leftcolumn">
          <div className="card">
            <h3>ORDERED REPORTS</h3>
            <input
              type="text"
              placeholder="Search by occasion..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <br />
            <table id="customers" ref={tableRef}>
              <thead>
                <tr>
                  <th>Occasion</th>
                  <th>Head Count</th>
                  <th>Total Cost</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.map(report => (
                  <tr key={report._id}>
                    <td>{report.occasion}</td>
                    <td>{report.headCount}</td>
                    <td>{report.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button onClick={generatePDF}>Download PDF</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Admin;
