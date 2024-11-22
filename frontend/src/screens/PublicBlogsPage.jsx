import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Eye, User, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import defImg from "../../public/blog-temp.jpg";

const PublicBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  useEffect(() => {
    fetchPublicBlogs();
  }, []);

  useEffect(() => {
    const filtered = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBlogs(filtered);
  }, [searchTerm, blogs]);

  const fetchPublicBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/blogs");
      setBlogs(response.data);
      setFilteredBlogs(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
      setIsLoading(false);
    }
  };

  const truncateText = (text, maxLength = 150) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        Explore Our Blogs
      </h1>

      {/* Search Bar */}
      <div className="mb-8 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search blogs by title, content, or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="text-center text-gray-500 text-xl">
          No blogs found matching your search
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="relative">
                <img
                  src={
                    blog.images && blog.images.length > 0
                      ? `/${blog.images[0]}`
                      : defImg
                  }
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-20 hover:opacity-10 transition-opacity"></div>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold mb-3 text-gray-800 hover:text-blue-600 transition-colors">
                  {blog.title}
                </h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {truncateText(blog.content)}
                </p>

                <div className="flex justify-between items-center text-sm text-gray-500 mt-4">
                  <div className="flex items-center space-x-2">
                    <User size={16} />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} />
                    <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Link
                    to={`/blogs/${blog._id}`}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2"
                  >
                    <Eye size={18} />
                    <span>Read More</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicBlogsPage;
