const mongoose = require('mongoose');
const folderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Folder', folderSchema);