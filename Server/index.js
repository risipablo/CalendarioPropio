const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Note = require('./Models/Note');
const TareaModel = require('./Models/Tareas');
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());


mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Conexión exitosa con MongoDB'))
  .catch((err) => console.log('Conexión fallida: ' + err));


// Get all notes
app.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
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

// Add a note
app.post('/notes', async (req, res) => {
  try {
    const { date, note } = req.body;
    if (!date || !note) {
      return res.status(400).json({ error: 'Date and note are required' });
    }
    const existingNote = await Note.findOne({ date });
    if (existingNote) {
      existingNote.note = note;
      await existingNote.save();
    } else {
      const newNote = new Note({ date, note });
      await newNote.save();
    }
    res.json({ message: 'Nota agregada' });
  } catch (err) {
    console.error('Error al agregar la nota:', err);
    res.status(500).json({ error: err.message });
  }
});


// Eliminar notas
app.delete('/delete-notes/:id', async (req,res) => {
  const {id} = req.params;
  try {
    const result = await Note.findByIdAndDelete(id)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})



// Obtencion de tareas

app.get('/tasks', (req, res) => {
  TareaModel.find()
    .then(tasks => res.json(tasks))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Agregar tareas
app.post('/add-task', async (req, res) => {
  const { task, descripcion } = req.body;
  
  if (!task || !descripcion) {
    return res.status(400).json({ error: "Task and description are required" });
  }
  
  try {
    const nuevaTarea = new TareaModel({ task, descripcion });
    const result = await nuevaTarea.save();
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Marcar tareas realizadas
app.patch('/update-task/:id', async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;
  
  if (typeof completed !== 'boolean') {
    return res.status(400).json({ error: "Completed status is required and should be a boolean" });
  }
  
  try {
    const updatedTask = await TareaModel.findByIdAndUpdate(id, { completed }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar tareas
app.delete('/delete-task/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const deletedTask = await TareaModel.findByIdAndDelete(id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json({ message: "Task deleted successfully", deletedTask });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Editar Tareas
app.patch('/edit-task/:id', async (req, res) => {
  const { id } = req.params;
  const { task, descripcion } = req.body;
  
  if (!task || !descripcion) {
    return res.status(400).json({ error: "Task and description are required" });
  }
  
  try {
    const updatedTask = await TareaModel.findByIdAndUpdate(id, { task, descripcion }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// // ordenar tareas
// app.post('/update-order', async (req,res) => {
//   try{
//     const tasks = req.body;
//     const updatePromises = tasks.map((task,index) => {
//       return TareaModel.findByIdAndUpdate(task._id, {order:index}, {new:true});
//     });
//     await Promise.all(updatePromises);
//     res.json({message: "Orden actualizado"})
//   } catch{
//     res.status(500).json({ error: err.message });
//   }

// })


app.listen(3001, () => {
  console.log('Servidor funcionando en el puerto 3001');
});
