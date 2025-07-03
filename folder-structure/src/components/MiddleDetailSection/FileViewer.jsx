const FileViewerPanel = ({selectedFile, onClose}) => {

  if (!selectedFile) return null;

  return (
    <div className="file-viewer-panel">
      <div className="viewer-header">
        <span className="file-name">{selectedFile.name}</span>
        <img
          src="/src/assets/close.svg"
          alt="close"
          className="close-icon"
          onClick={() => onClose(null)}
        />
      </div>
      <div className="viewer-body">
        <iframe
          key={selectedFile.name}
          src={`http://localhost:3000/folder-structure-backend/uploads/${selectedFile.name}`}
          title={selectedFile.name}
          className="file-viewer-iframe"
        />
      </div>
    </div>
  );
};

export default FileViewerPanel;
