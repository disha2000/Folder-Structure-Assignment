import { useRef, useEffect, useState } from "react";
import "./ContextMenu.css";
import { useCreateFolderMutation } from "../../slices/folderSlice";

const CreateFolderModal = ({onClose, parentId }) => {
  const [folderForm, setFolderForm] = useState({
    folderName: "",
    folderDesc: "",
  });

  const modalRef = useRef(null);
  const [createFolder] = useCreateFolderMutation();

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
    try {
      await createFolder({...folderForm, parentId})
      setFolderForm({
        folderName: "",
        folderDesc: "",
      });
      onClose();
    } catch (error) {
      console.error("Folder creation failed:", error);
    }
  };

  const setTarget = (e) => {
    const { name, value } = e.target;
    setFolderForm((prevFolderForm) => ({
      ...prevFolderForm,
      [name]: value,
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

        <div className="h-divider"></div>

        <div className="folder-data-section">
          <label>Name</label>
          <input
            type="text"
            name="folderName"
            placeholder="Folder name"
            className="modal-input"
            value={folderForm.folderName}
            onChange={setTarget}
          />

          <label>Description</label>
          <input
            type="text"
            name="folderDesc"
            placeholder="Folder description"
            className="modal-input"
            value={folderForm.folderDesc}
            onChange={setTarget}
          />
        </div>

        <div className="h-divider"></div>

        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn create" onClick={handleCreateFolder}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderModal;
