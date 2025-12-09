import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const AdminPanel = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate()

  if(error){
    setTimeout(()=>{
        setError("")
    },2000)
  }

  {
    /* logout handler */
  }
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  useEffect(() => {
    if (!user.role === "admin") {
      navigate("/dashboard");
      return;
    }
    if (!user) {
      navigate("/");
      return;
    }
    getAllPendingLeaves(); //calling the function for all pending leaves
  }, []);

  {
    /* Fetching all pending leaves */
  }
  const getAllPendingLeaves = async () => {
    try {
      setError("");
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      const res = await fetch(
        "http://localhost:5000/api/leaves/admin/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.error(data.message || "Failed to fetch pending leaves");
      }
        setPendingLeaves(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  {
    /* Update the status of leave request */
  }
  const handleUpdateStatus = async (leaveId, status) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
const comments = "";

    try {
      const res = await fetch(`http://localhost:5000/api/leaves/${leaveId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, comments }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to update leave status");
      }
      setPendingLeaves((prev) => prev.filter((l) => l._id !== leaveId));
    } catch (error) {
      setError(error.message);
    }
  };
  if (!user || user.role !== "admin") return null;
  return (
    <div>
      <Navbar name={user.name} logout={handleLogOut} />
      <main className="p-6">
        {loading && <p className="text-zinc-300 mb-2">Loading pending leaves...</p>}
        {error && <p className="text-red-400 mb-2">{error}</p>}

        <div className="mb-4">
          <h3 className="text-2xl font-semibold">
            Pending Requests ({pendingLeaves.length})
          </h3>
          <p className="text-zinc-400 text-sm">
            Review and approve or reject leave applications.
          </p>
        </div>

        <div className="overflow-x-auto rounded-xl bg-zinc-800 shadow">
          <table className="min-w-full text-sm">
            <thead className="bg-zinc-700 text-left">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Days</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingLeaves.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-4 py-4 text-center text-zinc-400"
                  >
                    No pending leave requests.
                  </td>
                </tr>
              )}

              {pendingLeaves.map((leave) => (
                <tr
                  key={leave._id}
                  className="border-t border-zinc-700 hover:bg-zinc-750"
                >
                  <td className="px-4 py-3">
                    {leave.user?.name || "Unknown"}
                  </td>
                  <td className="px-4 py-3">
                    {leave.user?.email || "-"}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(leave.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(leave.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{leave.days}</td>
                  <td className="px-4 py-3">{leave.reason || "-"}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(leave._id, "approved")}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(leave._id, "rejected")}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;
