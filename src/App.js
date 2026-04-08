import logo from './logo.svg';
import './App.css';
import 'tailwindcss/tailwind.css';
import Register from './components/Register';
import RegisterCSV from './components/csv';
import PasswordReset from './components/change_password';


function App() {
  return (
    <div className="App">
      <PasswordReset />
      
    </div>
  );
}

export default App;
