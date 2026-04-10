import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Createsession = () => {
  const navigate = useNavigate();


  // Form States
  const [formData, setFormData] = useState({
    institute: '',
    subject: '',
    lessonName: '',
    sessionMode: 'Physical',
    startTime: '',
    endTime: '',
    date: '',
    expiryMinutes: 5 // Default expiration set to 5 minutes
  });

  const [location, setLocation] = useState({ lat: null, lng: null });
  const [otp, setOtp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // Seconds for the countdown

  // Countdown Logic: Runs every second when timeLeft > 0
  useEffect(() => {
    let timer;
    if (timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && otp) {
      setOtp("EXPIRED");
    }
    return () => clearInterval(timer);
  }, [timeLeft, otp]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateSession = async () => {
    setLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const currentLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setLocation(currentLoc);

        try {
          // We convert expiryMinutes to a Number here before sending to backend
          const payload = { 
            ...formData, 
            expiryMinutes: Number(formData.expiryMinutes), 
            location: currentLoc 
          };

          const response = await fetch('http://localhost:5000/api/sessions/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
          });

          const data = await response.json();
          if (response.ok) {
            setOtp(data.otp);
            // Set countdown based on the customized expiryMinutes
            setTimeLeft(Number(formData.expiryMinutes) * 60); 
            alert("Session Created Successfully!");
          }
        } catch (error) {
          alert("Error creating session");
        } finally {
          setLoading(false);
        }
      }, () => {
        alert("Please enable location services to create a session.");
        setLoading(false);
      });
    }
  };

  // Helper to format seconds into MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <main className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Lecture Session</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Institute</label>
            <select name="institute" value={formData.institute} onChange={handleInputChange} className="w-full border p-2 rounded">
              <option value="">Select Institute</option>
              <option value="FCT">FCT</option>
              <option value="InstituteA">InstituteA</option>
              <option value="Institute3">Institute3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Subject</label>
            <select name="subject" value={formData.subject} onChange={handleInputChange} className="w-full border p-2 rounded">
              <option value="">Select Subject</option>
              <option value="Maths for CT">Maths for CT</option>
              <option value="Maths for CS">Maths for CS</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">Lesson Name</label>
            <input type="text" name="lessonName" value={formData.lessonName} placeholder="Enter lesson title" onChange={handleInputChange} className="w-full border p-2 rounded" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">Session Mode</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input type="radio" name="sessionMode" value="Physical" checked={formData.sessionMode === 'Physical'} onChange={handleInputChange} /> Physical
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="sessionMode" value="Online" checked={formData.sessionMode === 'Online'} onChange={handleInputChange} /> Online
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleInputChange} className="w-full border p-2 rounded" />
          </div>
          <div className="flex gap-2">
            <div>
              <label className="block text-sm font-semibold mb-2">Start</label>
              <input type="time" name="startTime" value={formData.startTime} onChange={handleInputChange} className="w-full border p-2 rounded" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">End</label>
              <input type="time" name="endTime" value={formData.endTime} onChange={handleInputChange} className="w-full border p-2 rounded" />
            </div>
          </div>

          {/* OTP Expiration Range UI */}
          <div className="md:col-span-2 bg-indigo-50 p-4 rounded-lg border border-indigo-100">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-bold text-indigo-900">OTP Expiration Time</label>
              <span className="text-indigo-700 font-bold bg-white px-3 py-1 rounded-full shadow-sm">
                {formData.expiryMinutes} Minutes
              </span>
            </div>
            <input 
              type="range" 
              name="expiryMinutes" 
              min="1" 
              max="30" 
              value={formData.expiryMinutes} 
              onChange={handleInputChange}
              className="w-full h-2 bg-indigo-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-xs text-indigo-400 mt-2 font-medium">
              <span>1 min</span>
              <span>15 min</span>
              <span>30 min</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-4">
          <div className="flex gap-4">
            <button 
              onClick={handleCreateSession} 
              disabled={loading || (otp && otp !== "EXPIRED" && timeLeft > 0)}
              className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400 shadow-md"
            >
              {loading ? "Capturing Location..." : "Create Session"}
            </button>
            <button 
              onClick={() => {setOtp(null); setTimeLeft(0); setLocation({lat: null, lng: null})}}
              className="flex-1 bg-gray-200 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-300 transition border border-gray-300"
            >
              Reset Session
            </button>
          </div>

          {/* PERSISTENT OTP SECTION */}
          <div className={`mt-6 p-8 rounded-2xl border-2 border-dashed transition-all duration-500 text-center ${
            otp && otp !== "EXPIRED" ? "bg-indigo-50 border-indigo-400 opacity-100" : "bg-gray-50 border-gray-300 opacity-60"
          }`}>
            <p className={`text-sm font-bold uppercase tracking-widest mb-1 ${otp && otp !== "EXPIRED" ? "text-indigo-800" : "text-gray-400"}`}>
              {otp === "EXPIRED" ? "OTP EXPIRED" : otp ? "Active Session Code" : "OTP Not Generated"}
            </p>
            
            <h3 className={`text-6xl font-mono font-black tracking-widest transition-colors duration-500 ${
              otp && otp !== "EXPIRED" ? "text-indigo-700" : "text-gray-300"
            }`}>
              {otp && otp !== "EXPIRED" ? otp : "----"}
            </h3>

            {/* Countdown Timer Display */}
            {timeLeft > 0 && (
              <div className="mt-4 inline-block bg-white px-4 py-2 rounded-full border border-red-100 shadow-sm animate-pulse">
                <span className="text-red-600 font-bold text-lg font-mono">
                  Time Left: {formatTime(timeLeft)}
                </span>
              </div>
            )}

            {location.lat && otp && otp !== "EXPIRED" && (
              <p className="text-[10px] text-gray-400 mt-4 font-mono uppercase">
                Location Verified: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Createsession;