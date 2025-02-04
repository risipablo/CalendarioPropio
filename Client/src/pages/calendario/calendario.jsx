import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import "./calendario.css";

// const serverFront = "http://localhost:3001";
const serverFront = 'https://calendariopropio.onrender.com';

const Calender = () => {
    const [date, setDate] = useState(new Date());
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");

    const formatDate = (date) => {
        return date.toISOString().split("T")[0];
    };

    // Obtener notas del backend
    const fetchNotes = async () => {
        try {
            const formattedDate = formatDate(date);
            const response = await axios.get(
                `${serverFront}/api/notes/${formattedDate}`
            );
            setNotes(response.data);
        } catch (err) {
            console.error("Error obteniendo notas:", err);
        }
    };

    // Agregar una nota al backend
    const addNote = async () => {
      if (!newNote.trim()) return;
  
      try {
          const formattedDate = formatDate(date);
          const response = await axios.post(`${serverFront}/api/notes`, {
            date: formattedDate,
            content: newNote,
          });
          setNotes([...notes, response.data]);
          setNewNote("");
      } catch (err) {
          console.error("Error agregando nota:", err);
      }
  };



    // Eliminar una nota del backend
    const deleteNote = async (content) => {
        try {
            const formattedDate = formatDate(date);
            await axios.delete(`${serverFront}/api/notes`, { 
                data: { 
                    date: formattedDate, 
                    content 
                } 
            });
            setNotes(notes.filter(note => note !== content)); 
        } catch (err) {
            console.error("Error eliminando nota:", err);
        }
    };

    // Efecto para cargar notas cuando cambia la fecha
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
                            <li key={index}>
                                {note}
                                <button onClick={() => deleteNote(note)}>
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="input">
                    <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Escriba alguna nota"
                        onKeyPress={(e) => e.key === 'Enter' && addNote()}
                    />
                    <button onClick={addNote}>Agregar</button>
                    </div>

                </div>

        </div>
    );
};

export default Calender;