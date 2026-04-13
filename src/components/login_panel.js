import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPanel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  // Optional: Add a loading state to prevent multiple submissions
  if (loading) return; // 🚫 prevents multiple clicks

  // Input validation (optional but recommended)
  if (!email.includes("@")) {
    setError("Please enter a valid email address.");
    return;
  }
  if (password.length < 3) {
    setError("Password must be at least 3 characters long.");
    return;
  }
  setLoading(true); // 🚀 start loading

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
      setError("Invalid email or password");
    }
  } catch (err) {
    setError('Server error. Please check if your backend is running.');
  } finally {
    setLoading(false); // 🚀 stop loading
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
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white transition-colors ${
              loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
          {loading ? "Signing In..." : "Sign In"}
          </button>
            <span
           onClick={() => navigate('/choose-password-reset')}
           className="text-indigo-600 hover:underline cursor-pointer"
          >Forget Password?</span>
        </form>
      </div>
    </div>
  );
};

export default LoginPanel;