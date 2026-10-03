import { useRef, useState } from "react";

import styles from "./ResumeUpload.module.css";
import api from "../../api/api";

import { useAuth } from "../../context/AuthContext";

function ResumeUpload({ onFileSelect }) {
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const { user } = useAuth();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    // Only PDF files are allowed
    const allowedTypes = [
      "application/pdf",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PDF resume.");
      return;
    }

    if (!user) {
      alert("Please login first.");
      return;
    }

    setSelectedFile(file);

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("resume", file);

      // Get Firebase authentication token
      const idToken = await user.getIdToken();

      // Upload resume with authentication token
      const response = await api.post(
        "/resume/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );

      console.log("Upload response:", response.data);

      // Send file + extracted resume text to Dashboard
      if (onFileSelect) {
        onFileSelect({
          file: file,
          text: response.data.text,
        });
      }

      alert("Resume uploaded successfully!");
    } catch (error) {
      console.error("Resume upload failed:", error);

      alert(
        error.response?.data?.message ||
          "Resume upload failed."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      {/* Selected file */}
      <div
        className={styles.resumeInput}
        onClick={handleUploadClick}
      >
        {selectedFile
          ? selectedFile.name
          : "Upload your resume"}
      </div>

      {/* Upload button */}
      <button
        type="button"
        className={styles.uploadButton}
        onClick={handleUploadClick}
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Resume"}
      </button>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        hidden
      />
    </div>
  );
}

export default ResumeUpload;