import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LecturerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const [sessions, setSessions] = useState([]);

  //fetch data from backend
  useEffect(() => {
    fetchSessions();
  }, []);
  
  const fetchSessions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/sessions", {
        headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    
    const data = await res.json();
    setSessions(data);
  } catch (err) {
    console.error(err);
  }
};

//delete session

const handleDelete = async (id) => {
  if (!window.confirm("Delete this session?")) return;
  await fetch(`http://localhost:5000/api/sessions/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });

  fetchSessions(); // refresh list
}

//download attendance CSV
const handleDownload = (session) => {
  const rows = session.attendedStudents.map((id) => ({
    studentId: id
  }));

  const csvContent =
    "data:text/csv;charset=utf-8," +
    ["Student ID"]
      .concat(rows.map(r => r.studentId))
      .join("\n");

  const link = document.createElement("a");
  link.href = encodeURI(csvContent);
  link.download = "attendance.csv";
  link.click();
};

  
  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  

  return (
  <div className="min-h-screen bg-gray-100 pb-10">
    
    {/* NAVBAR */}
    <nav className="bg-indigo-700 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-xl font-bold italic">Kelaniya Attendance | Lecturer</h1>

      <span className="mr-4 text-sm font-medium">
        Welcome, {user?.name || 'Lecturer'}
      </span>  

      <div className="flex gap-2">
        <button 
          onClick={() => navigate('/create-session')} 
          className="bg-green-500 px-3 py-2 rounded hover:bg-green-600 transition"
        >
          Create Session
        </button>

        <button 
          onClick={handleLogout} 
          className="bg-red-500 px-3 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>

    {/* SESSION HISTORY PANEL */}
    <div className="max-w-6xl mx-auto mt-10 bg-white p-6 rounded-xl shadow-lg border">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Session History
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          
          {/* HEADER */}
          <thead className="bg-gray-200">
            <tr className="text-gray-700">
              <th className="p-2">Date</th>
              <th className="p-2">Start</th>
              <th className="p-2">End</th>
              <th className="p-2">Subject</th>
              <th className="p-2">Institute</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {sessions.length > 0 ? (
              sessions.map((s) => (
                <tr key={s._id} className="text-center border-t hover:bg-gray-50">
                  <td className="p-2">
                    {new Date(s.date).toLocaleDateString()}
                  </td>
                  <td className="p-2">{s.startTime}</td>
                  <td className="p-2">{s.endTime}</td>
                  <td className="p-2">{s.subject}</td>
                  <td className="p-2">{s.institute}</td>

                  <td className="p-2 flex justify-center gap-2">
                    <button
                      onClick={() => handleDownload(s)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      CSV
                    </button>

                    <button
                      onClick={() => handleDelete(s._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500">
                  No sessions found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>

  </div>
);
};

export default LecturerDashboard;