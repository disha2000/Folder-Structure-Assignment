import { useGetFolderStatsQuery } from "../../slices/folderSlice";

const DocumentsMatrix = () => {
  const { data, isLoading} = useGetFolderStatsQuery();

  const folderCount = data?.folderCount ?? 0;
  const fileCount = data?.fileCount ?? 0;

  return (
    <div className="document-matrix-count">
      <div className="flex-col-container inner-matrix-count">
        <div>
          <img src="/src/assets/icon _folder_.svg" alt="folder" />
          <div style={{ fontSize: 12, fontWeight: 400 }}>Folders</div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>
            {isLoading ? "..." : folderCount}
          </div>
        </div>
        <div className="divider"></div>
        <div>
          <img src="/src/assets/icon _file_.svg" alt="file" />
          <div style={{ fontSize: 12, fontWeight: 400 }}>Files</div>
          <div style={{ fontWeight: 700, fontSize: 17 }}>
            {isLoading ? "..." : fileCount}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsMatrix;
