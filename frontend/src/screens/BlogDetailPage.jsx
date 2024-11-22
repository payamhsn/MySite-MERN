import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ArrowLeft, User, Calendar, Image } from "lucide-react";
import defImg from "../../public/blog-temp.jpg";

const BlogDetailPage = () => {
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    fetchBlogDetails();
  }, [id]);

  const fetchBlogDetails = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`/api/blogs/${id}`);
      setBlog(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching blog details:", error);
      toast.error("Failed to load blog details");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (!blog) {
    return <div className="text-center text-xl mt-8">Blog not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link
        to="/blogs"
        className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft size={20} className="mr-2" />
        Back to Blogs
      </Link>
      <article className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Hero Image Section */}
        <div className="relative">
          <img
            src={
              blog.images && blog.images.length > 0
                ? `/${blog.images[0]}`
                : defImg
            }
            alt={blog.title}
            className="w-full h-96 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>

        {/* Content Section */}
        <div className="p-8 relative z-10 -mt-16">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-4xl font-bold mb-4 text-gray-800">
              {blog.title}
            </h1>

            {/* Author and Date Info */}
            <div className="flex items-center text-gray-600 mb-6 space-x-4">
              <div className="flex items-center space-x-2">
                <User size={20} className="text-blue-500" />
                <span>{blog.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={20} className="text-blue-500" />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Blog Content */}
            <div className="prose max-w-none text-gray-700 leading-relaxed">
              {blog.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default BlogDetailPage;
