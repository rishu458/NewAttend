import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const submitAttendance = () => {
    console.log("Submitting code:", otp);
    // You will use the stored token here for the API call
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-emerald-600 text-white p-4 flex justify-between items-center">
        <h1 className="font-bold">Student Portal</h1>
        <button onClick={handleLogout} className="text-sm bg-emerald-700 px-3 py-1 rounded">Logout</button>
      </nav>

      <div className="p-6 max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-10 text-center">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
            🎓
          </div>
          <h2 className="text-xl font-bold text-gray-800">Hi, {user?.name}</h2>
          <p className="text-gray-500 text-sm mb-6">{user?.studentID || 'BICT Undergraduate'}</p>

          <div className="space-y-4">
            <label className="block text-left text-sm font-medium text-gray-700">Enter Lecture Code</label>
            <input 
              type="text" 
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="e.g. 5582"
              className="w-full border-2 border-gray-200 rounded-lg p-4 text-center text-3xl font-mono tracking-widest focus:border-emerald-500 outline-none"
            />
            <button 
              onClick={submitAttendance}
              className="w-full bg-emerald-600 text-white font-bold py-4 rounded-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-200"
            >
              Mark Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;