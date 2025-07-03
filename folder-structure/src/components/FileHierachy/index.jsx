import { useState } from "react";
import DocumentsMatrix from "./DocumentsMatrix";
import "./index.css";
import FolderTree from "./FolderTree";

const FileHierachy = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {!isOpen && (
        <img
          src="/src/assets/open-sidebar.svg"
          className="open-icon"
          onClick={() => setIsOpen(true)}
          alt="Open sidebar"
        />
      )}

      {isOpen && (
        <section className="left-hierachy-section">
          <img
            src="/src/assets/backdrop.svg"
            className="backdrop"
            onClick={() => setIsOpen(false)}
            alt="Close sidebar"
          />
          <div className="padding-15 heading">Folders & Documents</div>
          <DocumentsMatrix />
          <FolderTree/>
        </section>
      )}
    </>
  );
};

export default FileHierachy;
