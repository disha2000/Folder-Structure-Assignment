import { useEffect, useState } from "react";
import { useGetTreeQuery } from "../../slices/folderSlice";
import FolderItem from "./FolderItem";
import socket from "../../socket";

const FolderTree = () => {
  const { data: treeData, refetch } = useGetTreeQuery();
  const [expandedFolderPath, setExpandedFolderPath] = useState([]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (treeData?.length > 0 && expandedFolderPath.length === 0) {
      setExpandedFolderPath([treeData[0].id]);
    }
  }, [treeData, expandedFolderPath]);

  useEffect(() => {
    const handleUpdate = () => {
      refetch();
    };

    socket.on("update", handleUpdate);
    return () => socket.off("update", handleUpdate);
  }, [refetch]);

  return (
    <div className="folder-tree">
      {treeData?.map((item, index) => (
        <FolderItem
          key={item.id}
          item={item}
          level={0}
          isLast={index === treeData.length - 1}
          expandedFolderPath={expandedFolderPath}
          setExpandedFolderPath={setExpandedFolderPath}
        />
      ))}
    </div>
  );
};

export default FolderTree;
