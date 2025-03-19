import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaTrash, FaEdit, FaPlus } from "react-icons/fa";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from "axios";
import { IconButton, TextField, Box, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import "./calendario.css";


// const serverFront = "http://localhost:3001";
const serverFront = 'https://calendariopropio.onrender.com';

const Calender = () => {
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");
    const [editingNote, setEditingNote] = useState(null); // Nota que se está editando
    const [editedContent, setEditedContent] = useState(""); // Contenido editado

    const formatDate = (date) => {
        return date.toISOString().split("T")[0];
    };

    const fetchNotes = async () => {
        try {
            const formattedDate = formatDate(date);
            const response = await axios.get(`${serverFront}/api/notes/${formattedDate}`);
            setNotes(response.data);
        } catch (err) {
            console.error("Error obteniendo notas:", err);
        }
    };

    const addNote = async () => {
        if (!newNote.trim()) return;

        try {
            const formattedDate = formatDate(date);
            const response = await axios.post(`${serverFront}/api/notes`, {
                date: formattedDate,
                content: newNote,
            });
            setNotes([...notes, newNote]);
            setNewNote("");
        } catch (err) {
            console.error("Error agregando nota:", err);
        }
    };

    const deleteNote = async (content) => {
        try {
            const formattedDate = formatDate(date);
            await axios.delete(`${serverFront}/api/notes`, {
                data: { date: formattedDate, content },
            });
            setNotes(notes.filter((noteText) => noteText !== content));
        } catch (err) {
            console.error("Error eliminando nota:", err);
        }
    };

    const editNote = async () => {
        if (!editedContent.trim()) return;

        try {
            const formattedDate = formatDate(date);
            await axios.patch(`${serverFront}/api/notes`, {
                date: formattedDate,
                oldContent: editingNote,
                newContent: editedContent,
            });
            setNotes(notes.map((note) => (note === editingNote ? editedContent : note)));
            setEditingNote(null); // Finalizar edición
            setEditedContent("");
        } catch (err) {
            console.error("Error editando nota:", err);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, [date]);

    return (
        <div className="calendar-container">
            <h2>Calendario de Notas</h2>
            <Calendar onChange={setDate} value={date} />
            <div className="notes-container">
                <h3>Notas para el {date.toLocaleDateString()}</h3>
                <ul>
                    {notes.map((note, index) => (
                        <li key={index} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            {note}
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => {
                                    setEditingNote(note);
                                    setEditedContent(note);
                                }}
                            >
                                <FaEdit />
                            </IconButton>
                            <IconButton size="small" color="secondary" onClick={() => deleteNote(note)}>
                                <FaTrash />
                            </IconButton>
                        </li>
                    ))}
                </ul>
                <div className="input" >
                    <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Escriba alguna nota"
                        onKeyPress={(e) => e.key === "Enter" && addNote()}
                        fullWidth
                    />
                    <IconButton color="primary" onClick={addNote}>
                        <FaPlus />
                    </IconButton>
                </div>
            </div>

            {/* Popup para editar la nota */}
            <Dialog
                open={!!editingNote}
                onClose={() => setEditingNote(null)}
                // maxWidth="sm"
                fullWidth
            >
        
                <DialogContent>
                    <TextField
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        placeholder="Editar nota"
                        fullWidth
                        autoFocus
                    />
                </DialogContent>
                <DialogActions>
                <IconButton color="primary" onClick={editNote}>
                        <CheckCircleIcon />
                    </IconButton>

                    <IconButton
                        color="secondary"
                        onClick={() => {
                            setEditingNote(null);
                            setEditedContent("");
                        }}
                    >
                        <CancelIcon />
                    </IconButton>
  
                </DialogActions>
            </Dialog>
        </div>
    );
};


export default Calender;