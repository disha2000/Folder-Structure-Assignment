# 📁 Folder/File Structure Assignment

## **Problem Statement:**

Build a full-stack file management web application using **ReactJS**, **Node.js**, and **MongoDB**. Users should be able to:

* Create folders and upload files
* View a dynamic folder/file hierarchy
* Filter/search within directories
* View selected files (PDFs, images, etc.)
* Experience real-time updates and smooth UI interactions

---

## 🔗 Figma Link

[View Figma Design](https://www.figma.com/design/pRDbNDq47eeTX6XSCk3zem/NSM?node-id=3-2910&t=QwNrlztGwpVfg0R7-0)

---

## **Tech Stack:**

* **Frontend:** ReactJS, CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB

---

##  Folder Structure

### Frontend

```
/src
  ├─ components
  │    ├─ FileHeirachy/           # Left panel: folder/file tree and document matrix to show the folder and file count and file hierachy
  │    ├─ MiddleDetailSection/    # Center panel: detailed file/folder view 
  │    └─ TopPannel/              # Top section: context menu, breadcrumbs, filters
  ├─ context/                    # Shared state between folder tree and middle detail view -- when some folder clicked on left panel it should open in detail middle section
  ├─ slices/
  │    ├─ folderSlice.js         # Redux API slice for folders
  │    └─ fileSlice.js           # Redux API slice for files
  └─ socket.js                  # Socket client for real-time updates
```

### Backend

```
/server
  ├─ controllers/
  │    ├─ folderController.js # all api related routes logic binds here 
  │    └─ fileController.js
  ├─ routes/
  │    ├─ folderRoutes.js     # GET /tree, GET /specifictree, POST /
  │    └─ fileRoutes.js       # /uploadfile
  ├─ models/
  │    ├─ Folder.js
  │    └─ File.js
  └─ app.js        # Express setup and WebSocket integration
```

---

## Features

### Top Panel

* Breadcrumb navigation
* Context menu ("+" button for Create Folder / Upload File)
* Modal dialogs for file/folder creation
* Filter input to search by name, description, or created date

### Left Panel

* Folder & file hierarchy
* Expand/collapse folder structure
* Real-time update integration via WebSocket
* Upload progress bar for ongoing uploads

### Middle Panel

* Detailed list of selected folder's contents
* Pagination support
* Two-way binding with left panel (shared context)

### Right Panel

* Document viewer (PDF/Image/Text in iframe)

---

## ⚙️ Setup

### 1. Clone the Repository

```
git clone https://github.com/disha2000/Folder-Structure-Assignment.git
cd Folder-Structure-Assignment
```

### 2. Install Dependencies

```bash
# For backend
cd server
npm install

# For frontend
cd ../client
npm install
```

### 3. Environment Variables

Create `.env` file in the backend folder with:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### 4. Start Development Servers

```bash
# Start backend
cd folder-structure-backend
nodemon app.js

# Start frontend
cd folder-structure
npm run dev
```

---

## API Endpoints

### Folder

* `POST /api/folder/` — Create a new folder
* `GET /api/folder/tree` — Fetch full folder tree recursively including the files
* `GET /api/folder/stats` — To get Folder and Files count
* `GET /api/folder/specifictree?parentId=686576ca643305a43c1a2519` — Filtered specific folder using parent id i.e folder id and by query params (name, description, date)

### File

* `POST /api/file/` — Upload a file

---

## Architecture 

* Context API used for lightweight global state sharing
* websocket for real time upload of document and creation of folder
* Folder/file tree managed recursively in backend and frontend for efficient traversal
* Filtering handled server-side for  data response

---

## Output Sample
![image](https://github.com/user-attachments/assets/8982bc40-1f98-4d93-997b-00713a8ccc07)


