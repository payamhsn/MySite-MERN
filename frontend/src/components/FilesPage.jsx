import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiUpload, FiDownload, FiTrash2, FiFile } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "./Spinner";
import { toast } from "react-toastify";

const FilesPage = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/files");
      setFiles(response.data);
    } catch (error) {
      toast.error("Error fetching files");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      toast.error("File size exceeds 100MB limit");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await axios.post("/api/files", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      const uploadedFile = {
        ...response.data,
        size: file.size,
      };

      setFiles([...files, uploadedFile]);
      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Error uploading file");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`/api/files/${fileId}`);
      setFiles(files.filter((file) => file._id !== fileId));
      toast.success("File deleted successfully");
    } catch (error) {
      toast.error("Error deleting file");
    }
  };

  const handleDownload = async (fileId, filename) => {
    try {
      const response = await axios.get(`/api/files/${fileId}/download`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast.error("Error downloading file");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const fileInputRef = React.useRef(null);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex items-center justify-center">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">My Files</h2>

      <div
        className={`mb-8 border-2 border-dashed rounded-lg p-8 text-center ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files[0])}
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out inline-flex items-center"
          disabled={isUploading}
        >
          <FiUpload className="mr-2" />
          {isUploading ? "Uploading..." : "Upload File"}
        </button>
        <p className="mt-2 text-gray-600">or drag and drop your file here</p>
      </div>

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

      <AnimatePresence>
        {files.map((file) => (
          <motion.div
            key={file._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md p-6 mb-4 flex items-center justify-between hover:shadow-lg transition duration-300 ease-in-out"
          >
            <div className="flex items-center">
              <FiFile className="text-4xl text-blue-500 mr-4" />
              <div>
                <h3 className="font-semibold text-lg text-gray-800">
                  {file.originalname}
                </h3>
                <p className="text-sm text-gray-500">
                  Uploaded on{" "}
                  {new Date(file.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-sm text-gray-500">
                  Size: {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handleDownload(file._id, file.originalname)}
                className="p-2 text-blue-600 hover:text-blue-800 transition duration-300 ease-in-out"
                title="Download"
              >
                <FiDownload className="text-xl" />
              </button>
              <button
                onClick={() => handleDelete(file._id)}
                className="p-2 text-red-600 hover:text-red-800 transition duration-300 ease-in-out"
                title="Delete"
              >
                <FiTrash2 className="text-xl" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {files.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No files uploaded yet. Upload a file to get started!
        </p>
      )}
    </div>
  );
};

export default FilesPage;
