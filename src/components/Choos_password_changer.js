import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PasswordResetModal({ isOpen}) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      
      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl p-6">

        {/* Close Button */}
        <button
          onClick={() => navigate("/")}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition"
        >
          <X size={22} />
        </button>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Reset Password
        </h2>

        {/* Buttons */}
        <div className="flex flex-col gap-4">
          
          {/* Lecturer Button */}
          <button
            onClick={() => navigate("/password-reset-lecturers")}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
          >
            Lecturer Password Reset
          </button>

          {/* Student Button */}
          <button
            onClick={() => navigate("/reset-password-students")}
            className="w-full py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition"
          >
            Student Password Reset
          </button>

        </div>
      </div>
    </div>
  );
}