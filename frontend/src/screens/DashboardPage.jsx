import DashboardTab from "../components/DashboardTab";
import NotesPage from "../components/NotesPage";
import BlogsPage from "../components/BlogsPage";
import React, { useState } from "react";
import FilesPage from "../components/FilesPage";
import Todos from "../components/Todos";
import {
  FiHome,
  FiCheckSquare,
  FiFileText,
  FiFolder,
  FiEdit,
} from "react-icons/fi";

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
      case "Blogs":
        return <BlogsPage />;
      default:
        return null;
    }
  };

  const tabs = [
    { name: "Dashboard", icon: <FiHome /> },
    { name: "Todos", icon: <FiCheckSquare /> },
    { name: "Notes", icon: <FiFileText /> },
    { name: "Files", icon: <FiFolder /> },
    { name: "Blogs", icon: <FiEdit /> },
  ];

  return (
    <div className="flex h-[calc(100vh-120px)]">
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-gray-800 text-white p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-6 text-gray-300 hidden md:block">
          {formattedDate}
        </h2>
        <nav>
          <ul className="space-y-4">
            {tabs.map((tab) => (
              <li key={tab.name}>
                <button
                  className={`w-full flex flex-col md:flex-row items-center justify-center md:justify-start space-y-1 md:space-y-0 md:space-x-3 px-2 md:px-4 py-3 rounded transition-colors duration-200 ${
                    activeTab === tab.name
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-700"
                  }`}
                  onClick={() => setActiveTab(tab.name)}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="text-xs md:text-base font-medium">
                    {tab.name}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default DashboardPage;
