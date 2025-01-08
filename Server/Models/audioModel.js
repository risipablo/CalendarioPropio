const mongoose = require('mongoose');


const audioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  // uploadedAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Audio', audioSchema);