import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { CurrentDirectoryContext } from "../../context/CurrentDirectory";
import { useGetTreeQuery } from "../../slices/folderSlice";
import "./Breadcrumb.css";
import { useContext } from "react";

const BreadCrumbNavigation = () => {
  const { selectedFolder, setSelectedFolder } = useContext(CurrentDirectoryContext);
  const { data: treeData } = useGetTreeQuery();

  const buildBreadcrumbPath = (folder, tree, path = []) => {
    if (!folder) return path;
    const current = { id: folder.id, name: folder.name };
    path.unshift(current);
    const parent = findParent(folder.id, tree);
    if (parent) {
      return buildBreadcrumbPath(parent, tree, path);
    }
    return path;
  };

  const findParent = (childId, tree) => {
    for (let node of tree) {
      if (node.children?.some((child) => child.id === childId)) return node;
      if (node.children?.length) {
        const found = findParent(childId, node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const breadcrumbPath =
    selectedFolder && treeData
      ? buildBreadcrumbPath(selectedFolder, treeData)
      : [];

  return (
    <div className="breadcrumb-container">
      {breadcrumbPath.map((folder, index) => (
        <span key={folder.id} className="breadcrumb-segment">
          <span
            className="breadcrumb-link"
            onClick={() => setSelectedFolder(folder)}
          >
            {folder.name}
          </span>
          {index < breadcrumbPath.length - 1 && (
            <FontAwesomeIcon
              icon={faChevronRight}
              className="breadcrumb-icon"
            />
          )}
        </span>
      ))}
    </div>
  );
};

export default BreadCrumbNavigation;
