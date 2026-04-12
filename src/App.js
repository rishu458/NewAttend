import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

// Import your components
import Login from './components/login_panel';
import Register from './components/Register';
import RegisterCSV from './components/csv';
import PasswordReset from './components/change_password';
import LecturerRegister from './components/Lec_Register';
import StudentDashboard from './pages/student_page';
import LecturerDashboard from './pages/lecturer_page';
import Createsession from './components/create_session';
import LecPasswordReset from './components/lecturer_password_change';
import StudentManagement from './components/StudentManagement';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Default Route: Show Login */}
          <Route path="/" element={<Login />} />
          
          {/* Dashboard Routes */}
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/lecturer-dashboard" element={<LecturerDashboard />} />
          <Route path="/create-session" element={<Createsession />} />
          <Route path="/password-reset-lecturers" element={<LecPasswordReset />} />
          <Route path="/reset-password-students" element={<PasswordReset />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-csv" element={<RegisterCSV />} />
          <Route path="/student-management" element={<StudentManagement />} />

          {/* Other Routes 
          
          
          
          <Route path="/lecturer-register" element={<LecturerRegister />} />
          */}

          {/* Catch-all: Redirect unknown paths back to Login */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;