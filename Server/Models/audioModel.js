const mongoose = require('mongoose');

const audioSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  filepath: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Audio', audioSchema);