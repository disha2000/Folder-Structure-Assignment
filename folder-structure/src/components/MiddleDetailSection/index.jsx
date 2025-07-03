import { useState, useRef, useEffect, useContext } from "react";
import { format } from "date-fns";
import "./index.css";
import CreateFolderModal from "../TopPannel/CreateFolderModal";
import UploadDocumentModal from "../TopPannel/UploadDocumentModal";
import "../TopPannel/ContextMenu.css";
import { CurrentDirectoryContext } from ".././../context/CurrentDirectory";

const MiddleSectionTable = ({ setSelectedFile }) => {
  const [expandedFolders, setExpandedFolders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);
  const { selectedFolder } = useContext(CurrentDirectoryContext);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleExpand = (folderId) => {
    setExpandedFolders((prev) =>
      prev.includes(folderId)
        ? prev.filter((id) => id !== folderId)
        : [...prev, folderId]
    );
  };

  const handleDropdownOpen = (e, item) => {
    const rect = e.target.getBoundingClientRect();
    const dropdownWidth = 160;
    const buffer = 10;

    setDropdownPosition({
      top: rect.bottom + window.scrollY + buffer,
      left:
        window.innerWidth - rect.left > dropdownWidth + buffer
          ? rect.left + window.scrollX
          : rect.right - dropdownWidth + window.scrollX,
    });

    triggerRef.current = e.target;
    setShowOptions(true);
    setSelectedItem(item);
  };

  const renderGroupedRows = (items, level = 0) =>
    items?.map((item) => {
      const isExpanded = expandedFolders.includes(item?.id);
      const isFolder = item?.type === "folder";

      return (
        <div
          key={item?.id}
          className={level === 0 ? "table-card" : "nested-row"}
        >
          <div
            className="table-row"
            onClick={() => {
              if (item.type === "file") {
                setSelectedFile(item);
              }
            }}
          >
            <span
              className="table-cell name"
              style={{ paddingLeft: `${level * 24}px` }}
              onClick={() => isFolder && toggleExpand(item.id)}
            >
              {isFolder && (
                <img
                  src={
                    isExpanded
                      ? "/src/assets/chevron_down.svg"
                      : "/src/assets/chevron_right.svg"
                  }
                  alt="toggle"
                  className="expand-icon"
                />
              )}
              <div className="icon-wrapper">
                <img
                  src={
                    isFolder
                      ? "/src/assets/icon _folder_.svg"
                      : "/src/assets/Google_docs.svg"
                  }
                  alt={item?.type}
                  className="icon"
                />
                {isFolder && item.children?.length > 0 && (
                  <span className="child-count-badge">{item.childCount}</span>
                )}
              </div>
              <span className="text-ellipsis">
                {item?.type === "folder" ? item?.name : item?.originalName}
              </span>
            </span>

            <span className="table-cell description ellipsis">
              {item?.description || "- - -"}
            </span>
            <span className="table-cell date">
              {item?.createdAt
                ? format(new Date(item?.createdAt), "dd/MM/yyyy HH:mm")
                : "17/03/2025 23:30"}
            </span>
            <span className="table-cell date">
              {item?.updatedAt
                ? format(new Date(item?.updatedAt), "dd/MM/yyyy HH:mm")
                : "17/03/2025 23:30"}
            </span>
            <span className="table-cell action">
              {item.type === "folder" && (
                <img
                  src="/src/assets/icon _ellipsis_.svg"
                  alt="options"
                  className="options-icon"
                  onClick={(e) => handleDropdownOpen(e, item)}
                />
              )}
            </span>
          </div>

          {isFolder && isExpanded && item.children?.length > 0 && (
            <div className="nested-children">
              {renderGroupedRows(item.children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  return (
    <div className="middle-container">
      <div className="middle-section-table">
        <div className="table-header">
          <span className="table-cell name">Name</span>
          <span className="table-cell description">Description</span>
          <span className="table-cell date">Created at</span>
          <span className="table-cell date">Updated at</span>
          <span className="table-cell action"></span>
        </div>

        <div className="table-body">
          {selectedFolder ? renderGroupedRows([selectedFolder]) : null}
        </div>

        {showOptions && (
          <div
            className="dropdown-options"
            ref={dropdownRef}
            style={{
              position: "absolute",
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              zIndex: 999,
            }}
          >
            <div
              className="dropdown-option"
              onClick={() => {
                setShowModal(true);
                setShowOptions(false);
              }}
            >
              Create Folder
            </div>
            <div className="h-divider"></div>
            <div
              className="dropdown-option"
              onClick={() => {
                setShowUploadModal(true);
                setShowOptions(false);
              }}
            >
              Upload Document
            </div>
          </div>
        )}

        {showModal && (
          <CreateFolderModal
            parentId={selectedItem?.id}
            onClose={() => setShowModal(false)}
          />
        )}
        {showUploadModal && (
          <UploadDocumentModal
            parentId={selectedItem?.id}
            onClose={() => setShowUploadModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MiddleSectionTable;
