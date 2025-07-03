const Folder = require("../models/Folder");
const File = require("../models/File");
const { buildTree } = require('../utils/buildTree');

exports.createFolder = async (req, res) => {
  const { folderName: name, folderDesc: description, parentId } = req.body;
  console.log(name, description, parentId)
  try {
    const folder = await Folder.create({ name, description, parentId });
    console.log("folder", folder);
    global.io.emit("update");
    res.status(201).json(folder);
  } catch (err) {
    res.status(500).json({ error: "Error creating folder" });
  }
};

exports.getTree = async (req, res) => {
  try {
    const tree = await buildTree(null, {});
    res.json(tree);
  } catch (err) {
    res.status(500).json({ error: "Error fetching tree" });
  }
};

exports.getSpecificTree = async (req, res) => {
  try {
    const { parentId, name, description, date } = req.query;

    const parent = await Folder.findById(parentId);
    if (!parent) {
      return res.status(404).json({ error: "Parent folder not found" });
    }

    const children = await buildTree(parentId, { name, description, date });

    const totalDescendants = children.reduce((acc, item) => {
      if (item.type === "folder") {
        return acc + 1 + (item.childCount || 0);
      }
      return acc + 1;
    }, 0);

    const result = {
      id: parent._id,
      name: parent.name,
      description: parent.description || "",
      createdAt: parent.createdAt,
      updatedAt: parent.updatedAt,
      parentId: parent.parentId || null,
      type: "folder",
      children,
      childCount: totalDescendants,
      originalName: parent.originalName || "",
    };

    res.json([result]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching tree" });
  }
};


exports.getStats = async (req, res) => {
  try {
    const folderCount = await Folder.countDocuments();
    const fileCount = await File.countDocuments();

    res.json({ folderCount, fileCount });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ error: "Failed to fetch document statistics" });
  }
};