
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
  const { id } = req.params;

  try {
    // Encuentra el documento que contiene la nota con el ID proporcionado
    const document = await NoteModel.findOne({ 'notes._id': id });

    if (!document) {
      return res.status(404).json({ message: 'No se encontró la nota con el ID proporcionado.' });
    }

    // Elimina la nota del array de notas
    document.notes.id(id).remove();
    await document.save();

    res.json({ message: 'Nota eliminada correctamente', updatedDocument: document });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};