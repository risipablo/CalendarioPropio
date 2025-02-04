const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    date: { type: String, required: true, unique: true }, // Fecha única por día
    notes: [{ type: String, required: true }] // Array de notas en el mismo día
});

module.exports = mongoose.model("Note", NoteSchema);