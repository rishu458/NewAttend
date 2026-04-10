import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  // Helper function to get Geolocation as a Promise
  const getStudentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          (err) => reject(err)
        );
      }
    });
  };

  const submitAttendance = async () => {
    if (!otp) return alert("Please enter the OTP code.");
    
    setLoading(true);
    let locationData = null;

    try {
      // 1. Fetch session details first to check mode (Physical vs Online)
      // This assumes your backend has a route to check a session by OTP
      const checkRes = await fetch(`http://localhost:5000/api/sessions/check/${otp}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      
      const sessionInfo = await checkRes.json();

      if (!checkRes.ok) {
        throw new Error(sessionInfo.message || "Invalid or Expired OTP");
      }

      // 2. Conditional Location Tracking
      if (sessionInfo.sessionMode === 'Physical') {
        try {
          alert("Physical session detected. Capturing location for verification...");
          locationData = await getStudentLocation();
        } catch (locErr) {
          throw new Error("Location access is required for Physical sessions. Please enable GPS.");
        }
      }

      // 3. Mark Attendance
      const response = await fetch('http://localhost:5000/api/sessions/mark-attendance', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({
          otp: otp,
          location: locationData, // Will be null for Online, coordinates for Physical
          studentId: user?._id || user?.id,    // Extracted from the local user object
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Attendance marked successfully! ✅");
        setOtp('');
      } else {
        alert(result.message || "Failed to mark attendance.");
      }

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-emerald-600 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="font-bold">Student Portal | University of Kelaniya</h1>
        <div className="flex items-center gap-4">
          <span className="text-xs hidden md:block">Session Active</span>
          <button onClick={handleLogout} className="text-sm bg-emerald-700 hover:bg-emerald-800 px-3 py-1 rounded transition">Logout</button>
        </div>
      </nav>

      <div className="p-6 max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-10 text-center border border-gray-100">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl shadow-inner">
            🎓
          </div>
          <h2 className="text-xl font-bold text-gray-800">Hi, {user?.name}</h2>
          <p className="text-gray-500 text-sm mb-6">{user?.studentID || 'BICT Undergraduate'}</p>

          <div className="space-y-4">
            <div className="text-left">
              <label className="block text-sm font-semibold text-gray-600 mb-1">Enter Lecture Code</label>
              <input 
                type="text" 
                maxLength="6"
                value={otp}
                onChange={(e) => {
                    const value = e.target.value;
                    if (/^\d*$/.test(value) && value.length <= 6){
                        setOtp(e.target.value);
                    }
                }}
                placeholder="000000"
                disabled={loading}
                className="w-full border-2 border-gray-200 rounded-xl p-4 text-center text-4xl font-mono tracking-[0.5em] focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all uppercase"
              />
            </div>
            
            <button 
              onClick={submitAttendance}
              disabled={loading || otp.length !== 6}
              className={`w-full text-white font-bold py-4 rounded-xl transition all duration-300 shadow-lg ${
                (loading || otp.length !== 6) ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : "Mark Attendance"}
            </button>
            
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-medium">
              Secure Location-Based Verification
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;