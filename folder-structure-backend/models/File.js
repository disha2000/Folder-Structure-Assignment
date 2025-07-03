const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    originalName: String,
    description: String,
    folderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folder',
      required: false,
    },
  }, { timestamps: true });
  
  module.exports = mongoose.model('File', fileSchema);
  