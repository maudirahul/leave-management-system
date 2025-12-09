import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const LeaveHistory = () => {
  const [leaves, setLeaves] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  {/* logout handler */}
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  {/* backToDashboard handler */}
  const backToDashboard = () => {
    navigate("/dashboard");
  };

   {/* if not logged in */}
    useEffect(() => {
      if (!user) {
        navigate("/");
        return;
      }
    }, [user, navigate]);
    if (!user) return null;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in");
      navigate("/");
      return;
    }
    const getLeaves = async () => {
      try {
        setError("");
        setLoading(true);
        const res = await fetch(" http://localhost:5000/api/leaves", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch leave history");
        }
        setLeaves(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getLeaves();
  }, [navigate]);

  return (
    <>
      <div>
        <Navbar name={user.name} logout={handleLogOut}>
          <button
            onClick={backToDashboard}
            className="w-fit bg-green-800 rounded p-1 cursor-pointer hover:bg-green-900"
          >
            Go To Dashboard
          </button>
        </Navbar>

       
        <main className="p-6">
          <h3 className="text-2xl font-semibold mb-4 flex justify-center">
            Leave History
          </h3>

          {loading && <p className="text-zinc-300 mb-2">Loading...</p>}
          {error && <p className="text-red-400 mb-2">{error}</p>}

          <div className="overflow-x-auto rounded-xl bg-zinc-800 shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-zinc-700 text-left">
                <tr>
                  <th className="px-4 py-3">Start Date</th>
                  <th className="px-4 py-3">End Date</th>
                  <th className="px-4 py-3">Days</th>
                  <th className="px-4 py-3">Reason</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 && !loading && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-4 text-center text-zinc-400"
                    >
                      No leave records found.
                    </td>
                  </tr>
                )}

                {leaves.map((leave) => (
                  <tr
                    key={leave._id}
                    className="border-t border-zinc-700 hover:bg-zinc-750"
                  >
                    <td className="px-4 py-3">
                      {new Date(leave.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{leave.days}</td>
                    <td className="px-4 py-3">{leave.reason || "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium
                          ${
                            leave.status === "approved"
                              ? "bg-green-600"
                              : leave.status === "pending"
                              ? "bg-yellow-500 text-black"
                              : "bg-red-600"
                          }`}
                      >
                        {leave.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
};

export default LeaveHistory;
