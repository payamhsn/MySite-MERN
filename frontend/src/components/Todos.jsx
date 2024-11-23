import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import { FiPlus, FiTrash2, FiCheck } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Todos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTodo, setNewTodo] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };
      const response = await axios.get("/api/todos", config);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      setSaving(true);
      const config = {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };
      const response = await axios.post(
        "/api/todos",
        { text: newTodo },
        config
      );
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
    } finally {
      setSaving(false);
    }
  };

  const updateTodo = async (id, completed) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };
      await axios.put(`/api/todos/${id}`, { completed }, config);
      setTodos(
        todos.map((todo) => (todo._id === id ? { ...todo, completed } : todo))
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${
            JSON.parse(localStorage.getItem("userInfo")).token
          }`,
        },
      };
      await axios.delete(`/api/todos/${id}`, config);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Todos</h2>
      <form onSubmit={addTodo} className="mb-8">
        <div className="flex items-center">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
            className="flex-grow p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600 transition duration-300 ease-in-out flex items-center justify-center"
            disabled={saving}
          >
            {saving ? (
              <Spinner size="small" className="text-white" />
            ) : (
              <FiPlus className="text-xl" />
            )}
          </button>
        </div>
      </form>
      <AnimatePresence>
        {todos.map((todo) => (
          <motion.div
            key={todo._id}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between p-4 mb-4 bg-gray-100 rounded-lg hover:shadow-md transition duration-300 ease-in-out"
          >
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => updateTodo(todo._id, !todo.completed)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-400"
              />
              <span
                className={`ml-3 text-lg ${
                  todo.completed
                    ? "line-through text-gray-500"
                    : "text-gray-800"
                }`}
              >
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => deleteTodo(todo._id)}
              className="text-red-500 hover:text-red-700 transition duration-300 ease-in-out"
            >
              <FiTrash2 className="text-xl" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      {todos.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No todos yet. Add one to get started!
        </p>
      )}
    </div>
  );
};

export default Todos;
