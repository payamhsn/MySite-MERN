import React, { useState, useEffect } from "react";
import axios from "axios";

const DashboardTab = () => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data } = await axios.get("/api/users/profile");
      setUser(data);
      setEditedUser({
        name: data.name,
        email: data.email,
        password: "",
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">Welcome, {user.name}!</h1>
      <button
        onClick={handleEditClick}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Edit Profile
      </button>

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

export default DashboardTab;
