import { useRef, useEffect, useState } from "react";
import "./ContextMenu.css";
import { useCreateFolderMutation } from "../../slices/folderSlice";

const CreateFolderModal = ({ onClose, parentId }) => {
  const [folderForm, setFolderForm] = useState({
    folderName: "",
    folderDesc: "",
  });

  const [formErrors, setFormErrors] = useState({
    name: "",
    desc: "",
    api: "",
  });

  const modalRef = useRef(null);
  const [createFolder, { isLoading }] = useCreateFolderMutation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleCreateFolder = async () => {
    const errors = {
      name: folderForm.folderName.trim() === "" ? "Folder name is required" : "",
      desc: folderForm.folderDesc.trim() === "" ? "Folder description is required" : "",
      api: "",
    };

    setFormErrors(errors);
    if (errors.name || errors.desc) return;

    try {
      await createFolder({ ...folderForm, parentId }).unwrap();
      setFolderForm({ folderName: "", folderDesc: "" });
      onClose();
    } catch (error) {
      console.error("Folder creation failed:", error);
      setFormErrors((prev) => ({
        ...prev,
        api: error?.data?.message || "Something went wrong",
      }));
    }
  };

  const setTarget = (e) => {
    const { name, value } = e.target;
    setFolderForm((prevFolderForm) => ({
      ...prevFolderForm,
      [name]: value,
    }));

    // Clear error message when user types
    setFormErrors((prev) => ({
      ...prev,
      [name === "folderName" ? "name" : "desc"]: "",
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <div className="modal-header flex-col-container">
          <h3>Create Folder</h3>
          <img
            src="/src/assets/close.svg"
            alt="close"
            className="closemodal"
            onClick={onClose}
          />
        </div>

        {formErrors.api && (
          <div style={{ color: "red", fontSize: "13px", marginBottom: "8px" }}>
            {formErrors.api}
          </div>
        )}

        <div className="h-divider"></div>

        <div className="folder-data-section">
          <div className="label">Name</div>
          <input
            type="text"
            name="folderName"
            placeholder="Folder name"
            className="modal-input"
            value={folderForm.folderName}
            onChange={setTarget}
          />
          {formErrors.name && (
            <div style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
              {formErrors.name}
            </div>
          )}

          <div className="label">Description</div>
          <input
            type="text"
            name="folderDesc"
            placeholder="Folder description"
            className="modal-input"
            value={folderForm.folderDesc}
            onChange={setTarget}
          />
          {formErrors.desc && (
            <div style={{ color: "red", fontSize: "12px"}}>
              {formErrors.desc}
            </div>
          )}
        </div>

        <div className="h-divider"></div>

        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            className="modal-btn create"
            onClick={handleCreateFolder}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;
