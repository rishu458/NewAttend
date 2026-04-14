import { useState } from "react";
import Papa from "papaparse";

function RegisterCSV() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a CSV file!");
      return;
    }

    setUploading(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async function (results) {
        const students = results.data;
        let successCount = 0;
        let duplicateCount = 0;

        for (const student of students) {
          try {
            const API_URL = process.env.REACT_APP_API_URL;
            const res = await fetch(
              `${API_URL}/api/student/register/manual`,
              {
                method: "POST",
                headers: { 
                  "Content-Type": "application/json",
                  'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(student),
              }
            );

            if (res.ok) {
              successCount++;
            } else {
              duplicateCount++;
            }
          } catch (err) {
            console.error(err);
          }
        }

        alert(
          `Upload completed!\nSuccessfully registered: ${successCount}\nDuplicates/skipped: ${duplicateCount}`
        );
        setUploading(false);
      },
      error: function (err) {
        console.error(err);
        alert("Error parsing CSV file");
        setUploading(false);
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Register Students via CSV
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            disabled={uploading}
            className={`w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold ${
              uploading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? "Uploading..." : "Upload CSV"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterCSV;