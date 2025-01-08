const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  date: { type: String, required: true },
  notes: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
      note: { type: String, required: true }
    }
  ]
});

module.exports = mongoose.model('Note', noteSchema);