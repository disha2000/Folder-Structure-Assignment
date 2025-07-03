import { useEffect, useRef, useState, useContext } from "react";
import "./index.css";
import { CurrentDirectoryContext } from "../../context/CurrentDirectory";

const FilterDropdown = ({ onClose }) => {
  const dropdownRef = useRef(null);
  const {
    filters: contextFilters,
    setFilters,
    refetch,
  } = useContext(CurrentDirectoryContext);

  const [localFilters, setLocalFilters] = useState({
    name: "",
    description: "",
    date: "",
  });

  // Load filters from localStorage or context
  useEffect(() => {
    const stored = localStorage.getItem("filters");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setLocalFilters({
          name: parsed.name || "",
          description: parsed.description || "",
          date: parsed.date || "",
        });
      } catch (e) {
      }
    } else if (contextFilters) {
      setLocalFilters({
        name: contextFilters.name || "",
        description: contextFilters.description || "",
        date: contextFilters.date || "",
      });
    }
  }, [contextFilters]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    localStorage.setItem("filters", JSON.stringify(localFilters));
    setFilters(localFilters);
    refetch();
    onClose();
  };

  const handleClear = () => {
    const cleared = { name: "", description: "", date: "" };
    setLocalFilters(cleared);
    localStorage.removeItem("filters");
    setFilters(cleared);
    refetch();
    onClose();
  };

  return (
    <div className="filter-dropdown" ref={dropdownRef}>
      <div className="filter-header">
        <span className="filter-title">Filters</span>
        <span className="flex-row">
          <span
            className="filter-clear"
            onClick={handleClear}
            style={{ textDecoration: "underline" }}
          >
            Clear
          </span>
          <img
            src="/src/assets/close.svg"
            alt="close"
            className="filter-close-icon"
            onClick={onClose}
          />
        </span>
      </div>

      <div className="h-divider"></div>

      <div className="filter-body">
        <label>
          Name
          <input
            type="text"
            name="name"
            placeholder="Folder name"
            value={localFilters.name}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Description
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={localFilters.description}
            onChange={handleInputChange}
          />
        </label>
        <label>
          Date
          <input
            type="date"
            name="date"
            value={localFilters.date}
            onChange={handleInputChange}
          />
        </label>
      </div>

      <div className="h-divider"></div>

      <div className="filter-footer">
        <button className="cancel-btn" onClick={onClose}>
          Cancel
        </button>
        <button className="apply-btn" onClick={handleApply}>
          Apply
        </button>
      </div>
    </div>
  );
};

export default FilterDropdown;
