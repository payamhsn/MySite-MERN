import React, { useState } from "react";
import Todos from "../components/Todos";
import NotesPage from "../components/NotesPage";
import DashboardTab from "../components/DashboardTab";
import FilesPage from "../components/FilesPage";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");

  // Get current date and day name
  const currentDate = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", options);

  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <DashboardTab />;
      case "Todos":
        return <Todos />;
      case "Notes":
        return <NotesPage />;
      case "Files":
        return <FilesPage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <div className="w-1/4 bg-gray-200 p-4 ">
        <h2 className="text-xl font-bold mb-4">{formattedDate}</h2>
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
          <li
            className={`cursor-pointer mb-2 ${
              activeTab === "Files" ? "font-bold" : ""
            }`}
            onClick={() => setActiveTab("Files")}
          >
            Files
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
