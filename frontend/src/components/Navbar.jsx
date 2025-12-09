import React, { Children } from "react";

const Navbar = ({ name, logout, children }) => {
  return (
    <>
    
    <header className="flex justify-between p-4">
      <h2>Leave Management System</h2>
      <h2>Welcome, {name}</h2>
      <div>
        {children}
        <button
          onClick={logout}
          className="w-fit bg-red-800 rounded p-1 cursor-pointer hover:bg-red-900 ml-10"
        >
          Logout
        </button>
      </div>
    </header>
      <hr />
    </>
  );
};

export default Navbar;
