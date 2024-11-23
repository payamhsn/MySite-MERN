import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiEdit, FiTrash2, FiSave, FiX } from "react-icons/fi";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };
      const response = await axios.get("/api/notes", config);
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const config = {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };
      if (editingNoteId) {
        await axios.put(
          `/api/notes/${editingNoteId}`,
          { title, content },
          config
        );
      } else {
        await axios.post("/api/notes", { title, content }, config);
      }
      fetchNotes();
      resetForm();
    } catch (error) {
      console.error("Error saving note:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };
      await axios.delete(`/api/notes/${id}`, config);
      fetchNotes();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingNoteId(note._id);
    setIsFormVisible(true);
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setEditingNoteId(null);
    setIsFormVisible(false);
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">My Notes</h2>
        <button
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out flex items-center"
        >
          {isFormVisible ? (
            <>
              <FiX className="mr-2" /> Close
            </>
          ) : (
            <>
              <FiPlus className="mr-2" /> New Note
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isFormVisible && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <form
              onSubmit={handleSubmit}
              className="mb-8 bg-white p-6 rounded-lg shadow-md"
            >
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="border p-2 mb-4 w-full rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Content"
                className="border p-2 mb-4 w-full h-32 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-300 ease-in-out flex items-center"
                >
                  {saving ? (
                    <Spinner size="small" className="text-white mr-2" />
                  ) : (
                    <FiSave className="mr-2" />
                  )}
                  {editingNoteId ? "Update Note" : "Save Note"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {notes.map((note) => (
            <motion.div
              key={note._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300 ease-in-out"
            >
              <h3 className="text-xl font-bold mb-2 text-gray-800">
                {note.title}
              </h3>
              <p className="mb-4 text-gray-600">{note.content}</p>
              <p className="text-sm text-gray-500 mb-4">
                {new Date(note.createdAt).toLocaleString()}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => handleEdit(note)}
                  className="text-blue-500 hover:text-blue-700 transition duration-300 ease-in-out mr-2"
                >
                  <FiEdit className="text-xl" />
                </button>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
                >
                  <FiTrash2 className="text-xl" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {notes.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No notes yet. Create one to get started!
        </p>
      )}
    </div>
  );
};

export default NotesPage;
