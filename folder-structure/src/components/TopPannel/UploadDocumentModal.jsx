
import { useRef, useEffect, useState } from "react";
import axios from "axios";

const UploadDocumentModal = ({ onClose, parentId }) => {
  const modalRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCompleted, setUploadCompleted] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleCreateFile = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setIsUploading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("parentId", parentId || "");

    try {
      await axios.post("/api/files", formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(percent);
        },
      });
      setUploadCompleted(true);
    } catch (err) {
      console.error("Upload failed:", err);
      setErrorMessage("Failed to upload file. Please try again.");
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header flex-col-container">
          <h3>Upload Document</h3>
          <img
            src="/src/assets/close.svg"
            alt="close"
            className="closemodal"
            onClick={onClose}
          />
        </div>

        <div className="h-divider"></div>

        {!isUploading && !uploadCompleted && (
          <div className="upload-section">
            <label>Browse document</label>
            <div className="browse-doc">
              <img
                src="/src/assets/upload.svg"
                alt="upload"
                className="upload-icon"
              />
              <span>{selectedFile?.name}</span>
              <input
                type="file"
                className="file-input"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </div>
          </div>
        )}

        {(isUploading || uploadCompleted) && selectedFile && (
          <div className="progress-container">
            <div className="uploading-file-name"><img src="/src/assets/Google_docs.svg" alt="doc sample icon"/>{selectedFile.name}</div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="progress-text">
              {uploadProgress}% upload completed
            </div>
          </div>
        )}

        <div className="h-divider"></div>

        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onClose}>
            Close
          </button>
          <button
            className={`modal-btn create ${!selectedFile || isLoading || isUploading || uploadCompleted ? 'disabled' : ''}`}

            onClick={handleCreateFile}
            disabled={
              !selectedFile ||
              isLoading ||
              isUploading ||
              uploadCompleted
            }
          >
            Upload
          </button>
        </div>

        {errorMessage && (
          <div className="error-message">{errorMessage}</div>
        )}
      </div>
    </div>
  );
};

export default UploadDocumentModal;