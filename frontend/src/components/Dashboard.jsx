import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const Dashboard = () => {
  const [approvedCount, setApprovedCount] = useState(0);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  {
    /* logout handler */
  }
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  {
    /* if not logged in & fetch the leaves to calculate approved leaves */
  }
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role === "admin") {
      navigate("/admin");
      return;
    }

    // fetch leave data
    const fetchLeaves = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await fetch("http://localhost:5000/api/leaves", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch leaves");
        }

        if (data) {
          setLeaves(data);
          const approved = data.filter(
            (leave) => leave.status === "approved"
          ).length;
          setApprovedCount(approved);
        } else {
          setApprovedCount(0);
        }
      } catch (err) {
        console.error(err);
        setApprovedCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);
  if (!user) return null;

  {
    /* navigate to leave form */
  }
  const handleApplyLeave = () => {
    navigate("/leaveform");
  };

  {
    /* navigate to leave history page */
  }
  const handleLeaveHistory = () => {
    navigate("/leavehistory");
  };

  return (
    <div>
      <Navbar name={user.name} logout={handleLogOut} />

      <hr />

      {user.role === "admin" ? (
        navigate("/admin")
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-5 mt-8 p-4 item-center">
            <div className="bg-blue-600 text-white p-5 rounded-xl shadow text-center">
              <h3 className="text-sm font-bold">Annual Leave</h3>
              <p className="text-2xl font-bold">
                {user.leaveBalance?.annual ?? 12} Days
              </p>
            </div>

            <div className="bg-green-600 text-white p-5 rounded-xl shadow text-center">
              <h3 className="text-sm font-bold">Casual Leave</h3>
              <p className="text-2xl font-bold">
                {user.leaveBalance?.casual ?? 5} Days
              </p>
            </div>

            <div className="bg-yellow-500 text-white p-5 rounded-xl shadow text-center">
              <h3 className="text-sm font-bold">Approved Requests</h3>
              <p className="text-2xl font-bold">
                {loading ? "Loading.." : approvedCount}
              </p>
            </div>
          </div>

          {/* Leave Apply & History Buttons */}
          <div className="flex justify-around mt-10">
            <button
              onClick={handleApplyLeave}
              className="w-50 bg-green-800 rounded cursor-pointer hover:bg-green-900 p-3"
            >
              Apply for Leave
            </button>

            <button
              onClick={handleLeaveHistory}
              className="w-50 bg-green-800 rounded cursor-pointer hover:bg-green-900 p-3"
            >
              Leave History
            </button>
          </div>
          <div className="mt-10 px-4">
            <h3 className="text-lg font-semibold mb-3 text-white">
              Recent Requests
            </h3>
            <div className="bg-zinc-800 rounded-xl overflow-x-auto">
              <table className="min-w-full text-sm text-white">
                <thead className="bg-zinc-700">
                  <tr>
                    <th className="px-4 py-2 text-left">From</th>
                    <th className="px-4 py-2 text-left">To</th>
                    <th className="px-4 py-2 text-left">Days</th>
                    <th className="px-4 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.slice(0, 5).map((l) => (
                    <tr key={l._id} className="border-t border-zinc-600">
                      <td className="px-4 py-2">
                        {new Date(l.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(l.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">{l.days}</td>
                      <td className="px-4 py-2">
                        <span
                          className={
                            "px-2 py-1 rounded text-xs font-medium " +
                            (l.status === "approved"
                              ? "bg-green-600"
                              : l.status === "pending"
                              ? "bg-yellow-500 text-black"
                              : "bg-red-600")
                          }
                        >
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
