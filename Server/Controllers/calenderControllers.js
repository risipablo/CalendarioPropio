
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
  const { date, noteContent } = req.body;

  try {
    const result = await NoteModel.findOneAndUpdate(
      { date },
      { $pull: { notes: noteContent } },
      { new: true }
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};