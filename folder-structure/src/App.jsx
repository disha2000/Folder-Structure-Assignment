import FileHierachy from "./components/FileHierachy";
import "./App.css";
import TopPannel from "./components/TopPannel";
import { Provider } from "react-redux";
import MiddleSectionTable from "./components/MiddleDetailSection";
import { store } from "./store";
import { useState } from "react";
import FileViewer from "./components/MiddleDetailSection/FileViewer";
import { CurrentDirectoryProvider } from "./context/CurrentDirectory";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);

  return (
    <section className="main-section">
      <Provider store={store}>
        <CurrentDirectoryProvider>
          <FileHierachy />
          <div className="middle-section">
            {selectedFile ? (
              <FileViewer
                selectedFile={selectedFile}
                onClose={() => setSelectedFile(null)}
              />
            ) : (
              <>
                <TopPannel />
                <MiddleSectionTable setSelectedFile={setSelectedFile} />
              </>
            )}
          </div>
        </CurrentDirectoryProvider>
      </Provider>
    </section>
  );
}

export default App;
