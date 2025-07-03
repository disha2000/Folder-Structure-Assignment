const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const folderRoutes = require('./Routes/folderRoutes');
const fileRoutes = require('./Routes/fileRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

global.io = io;

app.use(cors());
app.use(express.json());
app.use('/folder-structure-backend/uploads', express.static('uploads'));

mongoose.connect('mongodb://localhost:27017/filemanager');

app.use('/api/folders', folderRoutes);
app.use('/api/files', fileRoutes);

io.on('connection', (socket) => {
  console.log('Client connected');
});

server.listen(3000, () => console.log('Server running on port 3000'));