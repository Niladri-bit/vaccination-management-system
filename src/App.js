import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import StudentManagement from './pages/StudentManagement';
import VaccinationManagement from './pages/VaccinationManagement';
import VaccinationReport from './pages/VaccinationReport';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/students" element={<StudentManagement />} />
        <Route path="vaccinations" element={<VaccinationManagement />} />
        <Route path="reports" element={<VaccinationReport />} />
        {/* Later we will add dashboard here */}
      </Routes>
    </Router>
  );
}

export default App;
