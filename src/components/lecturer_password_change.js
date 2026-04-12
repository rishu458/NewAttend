import { useState } from "react";

function LecPasswordReset() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  // Generate OTP
  const handleGenerateOtp = async () => {
    if (!email || !newPassword || !confirmPassword) {
      alert("Please fill all fields before generating OTP");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:5000/api/lecturer/generate-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, newPassword }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("OTP sent to your email!");
        setOtpSent(true);
      } else {
        alert(data.message || "Failed to generate OTP");
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Error generating OTP");
      setLoading(false);
    }
  };

  // Submit new password with OTP
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Please enter the OTP sent to your email");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        "http://localhost:5000/api/lecturer/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        alert("Password changed successfully!");
        // Reset all fields
        setEmail("");
        setNewPassword("");
        setConfirmPassword("");
        setOtp("");
        setOtpSent(false);
      } else {
        alert(data.message || "Failed to reset password");
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      alert("Error resetting password");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* New Password */}
          <div>
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* OTP field (only show after generating OTP) */}
          {otpSent && (
            <div>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleGenerateOtp}
              disabled={loading}
              className={`flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : "Generate OTP"}
            </button>

            {otpSent && (
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

export default LecPasswordReset;