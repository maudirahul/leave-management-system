import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setUser({
      ...user,
      email: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setUser({
      ...user,
      password: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (user.email.trim() === "" || user.password.trim() === "") {
      setError("Fill the details");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      if(data.user.role === "admin"){
        navigate("/admin")
      }else{
        navigate("/dashboard");
      }
      setUser({
        email: "",
        password: "",
      });
    } catch (error) {
      console.error(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {error && (
        <em className="bg-red-400 w-50 rounded mt-2 text-xl flex justify-center">{error}</em>
      )}

      <div className="flex justify-center h-screen items-center gap-7">
        <div>
          <h1 className="text-5xl font-bold">Leave Management</h1>
          <h1 className="text-5xl font-bold justify-center flex">System</h1>
        </div>
        <div className="bg-zinc-700 w-100 h-60 p-5 rounded-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              value={user.email}
              placeholder="Enter your email"
              onChange={handleEmailChange}
              className="border inline-block mb-2 p-2 rounded-lg mt-1"
            />
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              value={user.password}
              placeholder="Enter your password"
              onChange={handlePasswordChange}
              className="border rounded-lg inline-block p-2 mt-1"
            />
            <button
              type="submit"
              className="bg-blue-700 rounded-lg p-2 w-25 self-center mt-4 cursor-pointer hover:bg-blue-800"
            >
              {loading ? "Logging.." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
