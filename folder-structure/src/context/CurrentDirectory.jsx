import { createContext, useState, useEffect } from "react";
import {
  useGetTreeQuery,
  useGetSpecificTreeQuery,
} from "../slices/folderSlice";
import socket from "../socket";

export const CurrentDirectoryContext = createContext();

export const CurrentDirectoryProvider = ({ children }) => {
  const { data: initialTreeData, refetch: refetchInitialTree } = useGetTreeQuery();

  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const [filters, setFilters] = useState(() => {
    const stored = localStorage.getItem("filters");
    return stored
      ? { ...JSON.parse(stored) }
      : { name: "", description: "", date: "" };
  });

  const actualFilters = { ...filters, parentId: selectedFolderId };

  const {
    data: specificTreeData,
    refetch: refetchSpecificTree,
  } = useGetSpecificTreeQuery(actualFilters, {
    skip: !selectedFolderId,
  });

  useEffect(() => {
    if (!selectedFolderId && initialTreeData?.length > 0) {
      const root = initialTreeData[0];
      setSelectedFolderId(root.id);
      setSelectedFolder(root);
    }
  }, [initialTreeData, selectedFolderId]);

useEffect(() => {
  if (!selectedFolderId) return;

  const hasFilters = filters.name || filters.description || filters.date;
  const sourceTree = hasFilters ? specificTreeData : initialTreeData;

  if (!sourceTree) return;

  const findById = (id, nodes) => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findById(id, node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const updatedFolder = findById(selectedFolderId, sourceTree);
  if (updatedFolder) {
    setSelectedFolder(updatedFolder);
  }
}, [initialTreeData, specificTreeData, selectedFolderId, filters]);


  useEffect(() => {
    const handleUpdate = () => {
      if (selectedFolderId) {
        refetchSpecificTree();
      } else {
        refetchInitialTree();
      }
    };

    socket.on("update", handleUpdate);
    return () => socket.off("update", handleUpdate);
  }, [refetchInitialTree, refetchSpecificTree, selectedFolderId]);

  const updateSelectedFolder = (folder) => {
    setSelectedFolderId(folder.id);
    setSelectedFolder(folder);
  };

  const updateFilters = (newFilters) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      localStorage.setItem("filters", JSON.stringify(updated));
      return updated;
    });
  };

  const clearFilters = () => {
    const cleared = { name: "", description: "", date: "" };
    localStorage.removeItem("filters");
    setFilters(cleared);
  };

  return (
    <CurrentDirectoryContext.Provider
      value={{
        selectedFolder,
        selectedFolderId,
        setSelectedFolderId,
        setSelectedFolder: updateSelectedFolder,
        filters,
        setFilters: updateFilters,
        clearFilters,
        refetch: selectedFolderId ? refetchSpecificTree : refetchInitialTree,
        treeData: selectedFolderId ? specificTreeData : initialTreeData,
      }}
    >
      {children}
    </CurrentDirectoryContext.Provider>
  );
};
