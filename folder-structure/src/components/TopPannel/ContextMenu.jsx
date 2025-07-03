import { useState, useRef, useEffect} from "react";
import "./ContextMenu.css";
import CreateFolderModal from "./CreateFolderModal";
import UploadDocumentModal from "./UploadDocumentModal";
import FilterDropdown from "./FilterDropdown";

const ContextMenu = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ left: 0 });
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const menuRef = useRef(null);
  const addIconRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !addIconRef.current.contains(event.target)
      ) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (!showOptions && addIconRef.current) {
      const rect = addIconRef.current.getBoundingClientRect();
      const dropdownWidth = 160;
      const buffer = 10;
      const fitsRight = window.innerWidth - rect.left > dropdownWidth + buffer;

      setDropdownPosition({
        left: fitsRight ? 0 : "auto",
        right: fitsRight ? "auto" : 0,
      });
    }

    setShowOptions((prev) => !prev);
  };

  const handleApply = (filters) => {
    console.log("Applied Filters:", filters);
    setShowFilter(false);
  };

  const handleClear = () => {
    console.log("Cleared filters");
  };
  return (
    <>
      <div className="context-menu" ref={menuRef}>
        <div style={{ position: "relative" }}>
          <img
            src="/src/assets/filter.svg"
            alt="Filter"
            className="icon"
            onClick={() => setShowFilter(!showFilter)}
          />

          {showFilter && (
            <FilterDropdown
              onClose={() => setShowFilter(false)}
              onApply={handleApply}
              onClear={handleClear}
            />
          )}
        </div>
        <div>
          <img
            ref={addIconRef}
            src="/src/assets/addfolder.png"
            alt="Add Folder"
            className="icon"
            onClick={toggleDropdown}
          />
        </div>

        {showOptions && (
          <div className="dropdown-options" style={dropdownPosition}>
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
      </div>

      {showModal && <CreateFolderModal onClose={() => setShowModal(false)} parentId={null}/>}
      {showUploadModal && (
        <UploadDocumentModal onClose={() => setShowUploadModal(false)} parentId={null}/>
      )}
    </>
  );
};

export default ContextMenu;
