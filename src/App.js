import logo from './logo.svg';
import './App.css';
import 'tailwindcss/tailwind.css';
import Register from './components/Register';
import RegisterCSV from './components/csv';
import PasswordReset from './components/change_password';
import LecturerRegister from './components/Lec_Register';
import Login from './components/login_panel';


function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
