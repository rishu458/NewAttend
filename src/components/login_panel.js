import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPanel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  try {
    const response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // ✅ Matches your BE: res.status(200).json({ user, token, role });
      localStorage.setItem("token", data.token);
      
      // Optional: Store user info (name, etc.) if you want to show it on the dashboard
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.role === "lecturer") {
        navigate("/lecturer-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } else {
      // ✅ This will display "User not found 👤⛔" or "Invalid credentials"
      setError(data.message);
    }
  } catch (err) {
    setError('Server error. Please check if your backend is running.');
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
          University Portal Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-4 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="vishan@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            Sign In
          </button>
          <span
           onClick={() => navigate('/password-reset-lecturers')}
           className="text-indigo-600 hover:underline cursor-pointer"
          >Change password for lecturere
          </span>
        </form>
      </div>
    </div>
  );
};

export default LoginPanel;