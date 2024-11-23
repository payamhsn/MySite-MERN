import React, { useState, useEffect } from "react";
import Spinner from "./Spinner";
import axios from "axios";
import {
  BsFiles,
  BsListCheck,
  BsJournalText,
  BsPencilSquare,
} from "react-icons/bs";

const DashboardTab = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [counts, setCounts] = useState({
    notes: 0,
    todos: { total: 0, completed: 0, uncompleted: 0 },
    files: 0,
    blogs: 0,
  });

  useEffect(() => {
    fetchUserData();
    fetchCounts();
  }, []);

  const fetchCounts = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };

      const [notesResponse, todosResponse, filesResponse, blogsResponse] =
        await Promise.all([
          axios.get("/api/notes/count", config),
          axios.get("/api/todos/count", config),
          axios.get("/api/files/count", config),
          axios.get("/api/blogs/count", config),
        ]);

      setCounts({
        notes: notesResponse.data.count,
        todos: todosResponse.data,
        files: filesResponse.data.count,
        blogs: blogsResponse.data.count,
      });
    } catch (error) {
      console.error("Error fetching counts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/users/profile");
      setUser(data);
      setEditedUser({
        name: data.name,
        email: data.email,
        password: "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put("/api/users/profile", editedUser);
      setUser({ ...user, ...editedUser });
      setIsModalOpen(false);
      // Optionally, you can show a success message here
    } catch (error) {
      console.error("Error updating user data:", error);
      // Optionally, you can show an error message here
    }
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user.name}!
          </h1>
          <button
            onClick={handleEditClick}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Notes"
            count={counts.notes}
            icon={<BsJournalText className="text-yellow-500" size={24} />}
            color="bg-yellow-100"
          />
          <DashboardCard
            title="Todos"
            count={counts.todos.total}
            icon={<BsListCheck className="text-green-500" size={24} />}
            color="bg-green-100"
            subItems={[
              { label: "Completed", value: counts.todos.completed },
              { label: "Uncompleted", value: counts.todos.uncompleted },
            ]}
          />
          <DashboardCard
            title="Files"
            count={counts.files}
            icon={<BsFiles className="text-blue-500" size={24} />}
            color="bg-blue-100"
          />
          <DashboardCard
            title="Blogs"
            count={counts.blogs}
            icon={<BsPencilSquare className="text-purple-500" size={24} />}
            color="bg-purple-100"
          />
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-xl w-96">
            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
            <form>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={editedUser.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={editedUser.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password (leave blank to keep current)
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={editedUser.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveChanges}
                  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const DashboardCard = ({ title, count, icon, color, subItems }) => (
  <div
    className={`${color} p-6 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105`}
  >
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      {icon}
    </div>
    <p className="text-3xl font-bold text-gray-900">{count}</p>
    {subItems && (
      <div className="mt-4">
        {subItems.map((item, index) => (
          <div
            key={index}
            className="flex justify-between text-sm text-gray-600"
          >
            <span>{item.label}:</span>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default DashboardTab;
