import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PublicBlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPublicBlogs();
  }, []);

  const fetchPublicBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("/api/blogs");
      setBlogs(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      toast.error("Failed to load blogs");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading blogs...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Latest Blogs</h1>

      {blogs.length === 0 ? (
        <div className="text-center text-gray-500">No blogs found</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {blog.images && blog.images.length > 0 && (
                <img
                  src={`/${blog.images[0]}`}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{blog.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.content}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    By {blog.author}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
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
