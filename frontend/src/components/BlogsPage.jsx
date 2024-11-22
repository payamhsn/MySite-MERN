import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2, FiPaperclip } from "react-icons/fi";
import Spinner from "./Spinner";

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    images: [],
  });
  const [editingBlog, setEditingBlog] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const response = await axios.get("/api/blogs/my-blogs", config);
      setBlogs(response.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  // console.log(blogs.map((blog) => blog.images.map((image) => image)));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: e.target.files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("content", formData.content);

    // Append images
    if (formData.images) {
      Array.from(formData.images).forEach((image, index) => {
        formDataToSend.append("images", image);
      });
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      };

      if (editingBlog) {
        // Update existing blog
        const response = await axios.put(
          `/api/blogs/${editingBlog._id}`,
          formDataToSend,
          config
        );
        setBlogs(
          blogs.map((blog) =>
            blog._id === editingBlog._id ? response.data : blog
          )
        );
        toast.success("Blog updated successfully");
      } else {
        // Create new blog
        const response = await axios.post("/api/blogs", formDataToSend, config);
        setBlogs([response.data, ...blogs]);
        toast.success("Blog created successfully");
      }

      // Reset form
      setFormData({ title: "", content: "", images: [] });
      setEditingBlog(null);
    } catch (error) {
      toast.error("Error saving blog");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      images: [], // Will be handled separately
    });
  };

  const handleDelete = async (blogId) => {
    try {
      await axios.delete(`/api/blogs/${blogId}`);
      setBlogs(blogs.filter((blog) => blog._id !== blogId));
      toast.success("Blog deleted successfully");
    } catch (error) {
      toast.error("Error deleting blog");
    }
  };

  return (
    <div className="p-4">
      {loading ? (
        <div className="h-[50vh] flex items-center justify-center">
          <Spinner size="large" />
        </div>
      ) : (
        <>
          {isUploading && (
            <div className="mb-6">
              <div className="w-full h-2 bg-gray-200 rounded">
                <div
                  className="h-2 bg-blue-600 rounded"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
          <form
            onSubmit={handleSubmit}
            className="mb-6 bg-white p-6 rounded shadow"
          >
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Content
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows="4"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Images (optional)
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              disabled={isUploading}
            >
              {editingBlog ? "Update" : "Create"} Blog
            </button>
            {editingBlog && (
              <button
                type="button"
                onClick={() => {
                  setEditingBlog(null);
                  setFormData({ title: "", content: "", images: [] });
                }}
                className="ml-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Cancel
              </button>
            )}
          </form>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">{blog.title}</h3>
                <p className="text-gray-600 mb-2 truncate">{blog.content}</p>
                {blog.images && blog.images.length > 0 && (
                  <div className="flex space-x-2 mb-2">
                    {blog.images.map((image, index) => (
                      <img
                        key={index}
                        src={`/${image}`}
                        alt={`Blog ${blog.title}`}
                        className="h-16 w-16 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BlogsPage;
