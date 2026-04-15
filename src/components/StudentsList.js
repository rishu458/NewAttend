import {useState } from "react";

function StudentManagement() {
  const [institution, setInstitution] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const institutions = ["FCT", "InstituteA", "Institute3"];

  // =========================
  // FETCH STUDENTS
  // =========================
  const fetchStudents = async (inst) => {
    if (!inst) return;

    setLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const res = await fetch(
        `${API_URL}/api/student/manage?institution=${inst}`,
        {
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const data = await res.json();
      setStudents(data || []);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HANDLE INSTITUTION CHANGE
  // =========================
  const handleInstitutionChange = (e) => {
    const inst = e.target.value;
    console.log("Selected:", inst);
    setInstitution(inst);
    fetchStudents(inst);
  };

  // =========================
  // REMOVE STUDENT (PUT request)
  // =========================
  const handleRemove = async (studentID) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this student?"
    );

    if (!confirmDelete) return;

    try {
      const API_URL = process.env.REACT_APP_API_URL;
      const res = await fetch(
        `${API_URL}/api/student/manage`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({
            studentID,
            action: "remove",
            institution,
          }),
        }
      );

      if (res.ok) {
        setStudents((prev) =>
          prev.filter((s) => s.studentID !== studentID)
        );
      } else {
        alert("Failed to remove student");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing student");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Student Management Panel
        </h1>

        {/* INSTITUTION SELECT */}
        <div className="mb-6">
          <select
            value={institution}
            onChange={handleInstitutionChange}
            className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Select Institution</option>
            {institutions.map((inst) => (
              <option key={inst} value={inst}>
                {inst}
              </option>
            ))}
          </select>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-gray-500">Loading students...</p>
        )}

        {/* TABLE */}
        {!loading && students.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Student ID</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{student.name}</td>
                    <td className="p-3">{student.studentID}</td>

                    <td className="p-3 text-center">
                      <button
                        onClick={() =>
                          handleRemove(student.studentID)
                        }
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && institution && students.length === 0 && (
          <p className="text-gray-500">
            No students found for {institution}
          </p>
        )}
      </div>
    </div>
  );
}

export default StudentManagement;