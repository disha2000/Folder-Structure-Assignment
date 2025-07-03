const File = require('../models/File');

exports.uploadFile = async (req, res) => {
  try {
    const { parentId } = req.body;

    const storedFileName = req.file.filename;

    const originalName = req.file.originalname;

    const newFile = new File({
      name: storedFileName,      
      originalName: originalName,
      folderId: parentId || null,
    });

    await newFile.save();
    global.io.emit("update");
    res.status(201).json(newFile);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
};

