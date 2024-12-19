
const NoteModel = require('../Models/calenderNotes');

exports.getCalender = async (req, res) => {
  try {
    const notes = await NoteModel.find();
    // Convertimos las notas en un objeto con fechas como claves
    const notesMap = notes.reduce((acc, note) => {
      acc[note.date] = note.notes;
      return acc;
    }, {});
    res.json(notesMap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.addCalender = async (req, res) => {
  const { date, note } = req.body;

  try {
    // Busca si ya existe una nota para la fecha dada
    const existingNote = await NoteModel.findOne({ date });

    if (existingNote) {
      // Si existe, añade la nueva nota al array
      existingNote.notes.push(note);
      await existingNote.save();
    } else {
      // Si no existe, crea un nuevo documento para la fecha
      await NoteModel.create({ date, notes: [note] });
    }

    res.status(200).json({ message: 'Nota añadida correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al agregar la nota' });
  }
};

exports.deleteCalender = async (req, res) => {
  const { noteId } = req.params;

  try {
    // Verificar si el campo 'notes' existe y es un array
    const document = await NoteModel.findOne({ 'notes.id': noteId });

    if (!document || !Array.isArray(document.notes)) {
      return res.status(404).json({ message: 'El campo notes no existe o no es un array.' });
    }

    // Aplicar $pull para eliminar la nota
    const result = await NoteModel.findOneAndUpdate(
      { 'notes.id': noteId },
      { $pull: { notes: { id: noteId } } },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: 'No se encontró la nota con el ID proporcionado.' });
    }

    res.json({ message: 'Nota eliminada correctamente', updatedDocument: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
