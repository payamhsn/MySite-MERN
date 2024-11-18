import React, { useState, useEffect } from "react";
import axios from "axios";

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
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
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
      setTitle("");
      setContent("");
      setEditingNoteId(null);
    } catch (error) {
      console.error("Error saving note:", error);
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
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Notes</h2>
      <form onSubmit={handleSubmit} className="mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="border p-2 mb-2 w-full"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="border p-2 mb-2 w-full h-32"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          {editingNoteId ? "Update Note" : "Add Note"}
        </button>
      </form>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div key={note._id} className="border p-4 rounded shadow">
            <h3 className="text-xl font-bold mb-2">{note.title}</h3>
            <p className="mb-4">{note.content}</p>
            <p className="text-sm text-gray-500 mb-2">
              {new Date(note.createdAt).toLocaleString()}
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => handleEdit(note)}
                className="bg-yellow-500 text-white p-2 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note._id)}
                className="bg-red-500 text-white p-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotesPage;
