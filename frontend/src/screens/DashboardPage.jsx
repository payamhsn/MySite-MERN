import React, { useState } from "react";
import Todos from "../components/Todos";
import NotesPage from "../components/NotesPage";
import DashboardTab from "../components/DashboardTab";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardTab />;
      case "Todos":
        return <Todos />;
      case "Notes":
        return <NotesPage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4 bg-gray-200 p-4 ">
        <h2 className="text-xl font-bold mb-4">Panel</h2>
        <ul className="">
          <li
            className={`cursor-pointer mb-2 ${
              activeTab === "Dashboard" ? "font-bold" : ""
            }`}
            onClick={() => setActiveTab("Dashboard")}
          >
            Dashboard
          </li>
          <li
            className={`cursor-pointer mb-2 ${
              activeTab === "Todos" ? "font-bold" : ""
            }`}
            onClick={() => setActiveTab("Todos")}
          >
            Todos
          </li>
          <li
            className={`cursor-pointer mb-2 ${
              activeTab === "Notes" ? "font-bold" : ""
            }`}
            onClick={() => setActiveTab("Notes")}
          >
            Notes
          </li>
        </ul>
      </div>
      <div className="w-3/4 p-4">
        {/* <h1 className="text-3xl font-bold mb-5">Welcome to your Dashboard</h1> */}
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardPage;
