import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LeaveForm = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [form, setForm] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  //timer for showing error or success message 
  useEffect(() => {
  if (error || success) {
    const timer = setTimeout(() => {
      setError("");
      setSuccess("");
    }, 2000);

    return () => clearTimeout(timer);
  }
}, [error, success]);

  const navigate = useNavigate();
  {
    /* if not logged in */
  }
  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);
  if (!user) return null;

  
  const backToDashboard = ()=>{
     navigate("/dashboard");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (
      form.startDate.trim() === "" ||
      form.endDate.trim() === "" ||
      form.reason.trim() === ""
    ) {
      setError("Fill the details");
      return;
    }

    const start = new Date(form.startDate);
    const end = new Date(form.endDate);

    if (start > end) {
      setError("End date cannot be before start date.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Your not logged in, please log in again");
      navigate("/");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(" http://localhost:5000/api/leaves", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          startDate: form.startDate,
          endDate: form.endDate,
          reason: form.reason,
        }),
      });
      const data = res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to apply for leave");
      }
      setSuccess("Application submitted successfully");
      setForm({ startDate: "", endDate: "", reason: "" });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <em className="bg-red-400 w-50 rounded mt-2 text-xl flex justify-center mx-auto">
          {error}
        </em>
      )}

      {success && (
        <em className="bg-green-400 w-55 p-2 rounded mt-2 text-xl flex justify-center mx-auto">
          {success}
        </em>
      )}

      <div className="flex w-full min-h-screen items-center justify-center bg-zinc-900 p-4">
        <div className="w-full max-w-lg rounded-2xl bg-zinc-700 p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-white">Leave Application</h2>
            <p className="text-zinc-300 mt-2">
              Please fill in the details below
            </p>
          </div>

          <form onSubmit={handlesubmit} className="flex flex-col gap-6">
            {/* Date Row*/}
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <label
                  htmlFor="start-date"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  Start Date
                </label>
                <input
                  id="start-date"
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-500 bg-zinc-600 p-3 text-white placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="end-date"
                  className="mb-2 block text-sm font-medium text-white"
                >
                  End Date
                </label>
                <input
                  id="end-date"
                  type="date"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-zinc-500 bg-zinc-600 p-3 text-white placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Reason Field */}
            <div>
              <label
                htmlFor="reason"
                className="mb-2 block text-sm font-medium text-white"
              >
                Reason for Leave
              </label>
              <textarea
                id="reason"
                rows="4"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                className="w-full resize-none rounded-lg border border-zinc-500 bg-zinc-600 p-3 text-white placeholder-zinc-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Reason for leave..."
              ></textarea>
            </div>
          
          <div>
            {/* Submit Button */}
            <button
              type="submit"
              className="mt w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800 transition-colors"
            >
              {loading ? "Submitting" : "Submit Application"}
            </button>
            {/* Back to dashboard Button */}
            <button
          onClick={backToDashboard}
          className="mt w-full rounded-lg bg-green-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-800 transition-colors mt-2"
        >
          Go to Dashboard
        </button>
        </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default LeaveForm;
