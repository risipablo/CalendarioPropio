const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const NoteModel = require('./Models/Note');
const TareaModel = require('./Models/Tareas');
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

// Conexion con mongo
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Conexión exitosa con MongoDB'))
  .catch((err) => console.log('Conexión fallida: ' + err));

// Obtenemos todas la notas
app.get('/notes', async (req, res) => {
  try {
    const notes = await NoteModel.find();
    const notesMap = {};
    notes.forEach(note => {
      notesMap[note.date] = note;
    });
    res.json(notesMap);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Añadimos las notas
app.post('/add', async (req, res) => {
  try {
    const { date, note } = req.body;
    if (!date || !note) {
      return res.status(400).json({ error: 'Date and note are required' });
    }
    const existingNote = await NoteModel.findOne({ date });
    if (existingNote) {
      existingNote.note = note;
      await existingNote.save();
    } else {
      const newNote = new NoteModel({ date, note });
      await newNote.save();
    }
    res.json({ message: 'Nota agregada' });
  } catch (err) {
    console.error('Error al agregar la nota:', err);
    res.status(500).json({ error: err.message });
  }
});

// Eliminar notas
app.delete('/delete/:date', async (req, res) => {
  try {
    const date = req.params.date;
    await NoteModel.deleteOne({ date });
    res.json({ message: 'Nota eliminada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Ontencion de tareas
app.get('/tasks', (req, res) => {
  TareaModel.find()
    .then(tasks => res.json(tasks))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Agregar tareas
app.post('/add-task', (req, res) => {
  const { task, descripcion } = req.body;
  const newTask = new TareaModel({ task, descripcion });
  newTask.save()
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});

// marcar tareas realizadas
app.patch('/update-task/:id', (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  TareaModel.findByIdAndUpdate(id, { completed }, { new: true })
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});

// eliminar tareas
app.delete('/delete-task/:id', (req, res) => {
  const { id } = req.params;
  TareaModel.findByIdAndDelete(id)
    .then(result => res.json(result))
    .catch(err => res.status(500).json({ error: err.message }));
});



// Start the server
app.listen(3001, () => {
  console.log('Servidor funcionando en el puerto 3001');
});
