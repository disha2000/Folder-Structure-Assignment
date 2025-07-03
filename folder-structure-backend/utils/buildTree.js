const Folder = require("../models/Folder");
const File = require("../models/File");

async function buildTree(parentId = null, filters = {}) {
  const { name, description, date } = filters;

  let folderQuery = { parentId };
  let fileQuery = { folderId: parentId };

  if (name) {
    folderQuery.name = { $regex: name, $options: "i" };
    fileQuery.originalName = { $regex: name, $options: "i" };
  }

  if (description) {
    folderQuery.description = { $regex: description, $options: "i" };
    fileQuery.description = { $regex: description, $options: "i" };
  }

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    folderQuery.createdAt = { $gte: start, $lt: end };
    fileQuery.createdAt = { $gte: start, $lt: end };
  }

  const folders = await Folder.find(folderQuery);
  const files = await File.find(fileQuery);

  const folderChildren = await Promise.all(
    folders.map(async (folder) => {
      const children = await buildTree(folder._id, filters);

      const totalDescendants = children.reduce((acc, item) => {
        if (item.type === "folder") {
          return acc + 1 + (item.childCount || 0);
        }
        return acc + 1;
      }, 0);

      const matchesFilter =
        (!name || new RegExp(name, "i").test(folder.name)) &&
        (!description || new RegExp(description, "i").test(folder.description || "")) &&
        (!date || (folder.createdAt >= new Date(date) && folder.createdAt < new Date(new Date(date).setDate(new Date(date).getDate() + 1))));

      if (filters && !matchesFilter && children.length === 0) return null;

      return {
        id: folder._id,
        name: folder.name,
        description: folder.description || "",
        createdAt: folder.createdAt,
        updatedAt: folder.updatedAt,
        parentId: folder.parentId || null,
        type: "folder",
        children,
        childCount: totalDescendants,
        originalName: folder.originalName || "",
      };
    })
  );

  const filteredFolders = folderChildren.filter(Boolean);

  const fileChildren = files.map((file) => ({
    id: file._id,
    name: file.name,
    description: file.description || "",
    createdAt: file.createdAt,
    updatedAt: file.updatedAt,
    parentId: file.folderId || null,
    type: "file",
    originalName: file.originalName || "",
  }));

  return [...filteredFolders, ...fileChildren];
}

module.exports = { buildTree };
