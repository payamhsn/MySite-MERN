import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiUpload, FiDownload, FiTrash2 } from "react-icons/fi";
import Spinner from "./Spinner";

const FilesPage = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get("/api/files");
      setFiles(response.data);
    } catch (error) {
      toast.error("Error fetching files");
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

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

      setFiles([...files, response.data]);
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

  return (
    <div className="p-4">
      <div className="mb-6">
        <label className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out cursor-pointer">
          <input
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <FiUpload className="inline mr-2" />
          Upload File
        </label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => (
          <div
            key={file._id}
            className="border rounded-lg p-4 shadow hover:shadow-md transition-shadow"
          >
            <h3 className="font-semibold text-lg mb-2">{file.originalname}</h3>
            <p className="text-sm text-gray-500 mb-2">
              Uploaded on{" "}
              {new Date(file.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => handleDownload(file._id, file.originalname)}
                className="p-2 text-blue-600 hover:text-blue-800"
                title="Download"
              >
                <FiDownload />
              </button>
              <button
                onClick={() => handleDelete(file._id)}
                className="p-2 text-red-600 hover:text-red-800"
                title="Delete"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilesPage;
