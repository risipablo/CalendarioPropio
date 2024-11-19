
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
  const { date, noteContent } = req.body; // Asegúrate de que "noteContent" contenga el string de la nota

  try {
    const result = await NoteModel.findOneAndUpdate(
      { date }, // Busca el documento por la fecha
      { $pull: { notes: noteContent } }, // Elimina la nota específica del array
      { new: true } // Devuelve el documento actualizado
    );

    if (!result) {
      return res.status(404).json({ message: 'No se encontró la fecha especificada.' });
    }

    res.json({ message: 'Nota eliminada correctamente', updatedDocument: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};