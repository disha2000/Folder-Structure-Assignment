const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fileController = require('../controllers/fileController');

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const parentId = req.body.parentId;
  
      const folderPath = parentId
        ? path.join(__dirname, '../uploads', parentId)
        : path.join(__dirname, '../uploads');
  
      fs.mkdirSync(folderPath, { recursive: true });
      cb(null, folderPath);
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    }
  });
const upload = multer({ storage });

router.post('/', upload.single('file'), fileController.uploadFile);

module.exports = router;
