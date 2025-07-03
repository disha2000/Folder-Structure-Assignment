import { useContext } from "react";
import { CurrentDirectoryContext } from "../../context/CurrentDirectory";

const FolderItem = ({
  item,
  level = 0,
  isLast = false,
  expandedFolderPath,
  setExpandedFolderPath,
}) => {
  const { setSelectedFolderId } = useContext(CurrentDirectoryContext);

  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedFolderPath?.[level] === item?.id;

  const handleExpand = () => {
    setSelectedFolderId(item.id);

    const updatedPath = [...expandedFolderPath];
    if (isExpanded) {
      // collapse current level
      updatedPath.splice(level);
    } else {
      // expand new folder at this level
      updatedPath[level] = item.id;
      updatedPath.splice(level + 1); // remove deeper levels
    }
    setExpandedFolderPath(updatedPath);
  };

  return (
    <div
      className="folder-item"
      style={{ paddingLeft: level > 0 ? "20px" : "0px" }}
    >
      {level > 0 && (
        <div
          className="vertical-line"
          style={{ bottom: isLast ? "15px" : "0px" }}
        />
      )}

      <div
        className="item-container"
        style={{
          backgroundColor:
            item.type === "folder"
              ? isExpanded
                ? "#e5e9f5"
                : "white"
              : "#f7f8fb",
        }}
      >
        {level > 0 && <div className="horizontal-line" />}

        <div onClick={handleExpand} className="item-clickable">
          <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src={
                item.type === "folder"
                  ? "/src/assets/icon _folder_.svg"
                  : "/src/assets/icon _file_.svg"
              }
              alt={item.type}
              className="item-icon"
            />
            <span style={{ fontSize: 13, fontWeight: 400 }}>
              {item.type === "folder" ? item.name : item.originalName}
            </span>
          </span>
          {item.type === "folder" && (
            <span className="arrow-indicator">{isExpanded ? "-" : "+"}</span>
          )}
        </div>
      </div>

      {isExpanded &&
        hasChildren &&
        item.children.map((child, index) => (
          <FolderItem
            key={child.id}
            item={child}
            level={level + 1}
            isLast={index === item.children.length - 1}
            expandedFolderPath={expandedFolderPath}
            setExpandedFolderPath={setExpandedFolderPath}
          />
        ))}
    </div>
  );
};

export default FolderItem;
