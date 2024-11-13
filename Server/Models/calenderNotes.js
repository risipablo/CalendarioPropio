const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  date: { type: String, required: true },
  notes: { type: [String], default: [] }
});

module.exports = mongoose.model('Note', noteSchema);