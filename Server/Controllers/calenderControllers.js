const Note = require("../Models/calenderNotes");

// Obtener notas por fecha
exports.getNotesByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const note = await Note.findOne({ date });

        if (note) {
            res.json(note ? note.notes : []);// Devolver solo las notas en un array
        } else {
            res.json([]); // Si no hay notas, devolver un array vacío
        }
    } catch (err) {
        res.status(500).json({ error: "Error al obtener las notas" });
    }
};

// Agregar una nota
exports.addNote = async (req, res) => {
    try {
        const { date, content } = req.body;
        
        if (!date || !content) {
            return res.status(400).json({ error: "Fecha y contenido son obligatorios" });
        }

        // Busca si ya existe un documento para esa fecha
        let existingNote = await Note.findOne({ date });

        if (existingNote) {
            // Si existe, agrega la nueva nota al array
            existingNote.notes.push(content);
            await existingNote.save();
            res.status(201).json(existingNote.notes);
        } else {
            // Si no existe, crea un nuevo documento con la fecha y la primera nota
            const newNote = new Note({ date, notes: [content] });
            await newNote.save();
            res.status(201).json(newNote);
        }
    } catch (err) {
        console.error("Error en addNote:", err);
        res.status(500).json({ error: "Error al agregar la nota" });
    }
};


// Eliminar una nota
exports.deleteNote = async (req, res) => {
    try {
        const { date, content } = req.body;

        let existingNote = await Note.findOne({ date });

        if (!existingNote) {
            return res.status(404).json({ error: "No se encontraron notas para esta fecha" });
        }

        // Filtrar la nota a eliminar
        existingNote.notes = existingNote.notes.filter(note => note !== content);

        if (existingNote.notes.length > 0) {
            await existingNote.save(); 
        } else {
            await Note.findOneAndDelete({ date }); 
        }

        res.json({ message: "Nota eliminada" });
    } catch (err) {
        res.status(500).json({ error: "Error al eliminar la nota" });
    }
};


// Editar una nota específica
exports.editNote = async (req, res) => {
    try {
        const { date, oldContent, newContent } = req.body;

        if (!date || !oldContent || !newContent) {
            return res.status(400).json({ error: "Fecha, contenido antiguo y nuevo contenido son obligatorios" });
        }

        // Buscar el documento por fecha
        let existingNote = await Note.findOne({ date });

        if (!existingNote) {
            return res.status(404).json({ error: "No se encontraron notas para esta fecha" });
        }

        // Buscar y reemplazar la nota específica
        const noteIndex = existingNote.notes.indexOf(oldContent);
        if (noteIndex === -1) {
            return res.status(404).json({ error: "La nota no existe para esta fecha" });
        }

        existingNote.notes[noteIndex] = newContent; // Reemplazar el contenido de la nota
        await existingNote.save(); // Guardar los cambios

        res.json({ message: "Nota actualizada", notes: existingNote.notes });
    } catch (err) {
        console.error("Error al editar la nota:", err);
        res.status(500).json({ error: "Error al editar la nota" });
    }
};