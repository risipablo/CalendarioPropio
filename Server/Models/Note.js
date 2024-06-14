const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true },
  note: { type: String, required: true }
});

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;
