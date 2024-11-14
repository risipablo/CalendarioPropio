import React, { useState, useEffect } from 'react';

import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendario.css';
import axios from 'axios'

// const serverFront = "http://localhost:3001";
const serverFront = 'https://calendariopropio.onrender.com/'


const Calendario = () => {
  const [date, setDate] = useState(new Date());
  const [notes, setNotes] = useState({});
  const [currentNote, setCurrentNote] = useState('');
  const [isNotePanelVisible, setNotePanelVisible] = useState(false);

  // Cargar notas desde el backend al iniciar
  useEffect(() => {
    axios.get(`${serverFront}/api/notes`)
      .then(response => setNotes(response.data))
      .catch(err => console.error(err));
  }, []);

  // Manejar el cambio de fecha y mostrar el panel de notas
  const onChange = (newDate) => {
    setDate(newDate);
    setNotePanelVisible(true);
  };

  // Añadir una nueva nota
  const addNote = () => {
    const dateString = date.toDateString();
  
    if (currentNote.trim()) {
      axios.post(`${serverFront}/api/add-notes`, { date: dateString, note: currentNote })
        .then(response => {
          console.log('Nota añadida:', response.data);
          return axios.get(`${serverFront}/api/notes`);
        })
        .then(response => {
          setNotes(response.data);
          setCurrentNote('');
        })
        .catch(err => console.error('Error al agregar nota:', err));
    }
  };
  

  // Cerrar el panel de notas
  const closeNotePanel = () => {
    setNotePanelVisible(false);
  };


  const deleteNote = (noteContent) => {
    const dateString = date.toDateString();
  
    axios.delete(`${serverFront}/api/delete-notes`, { data: { date: dateString, noteContent } })
      .then(response => {
        console.log('Nota eliminada:', response.data);
        // Actualización del estado en el front-end
      })
      .catch(err => console.error('Error al eliminar nota:', err));
  };
  
  return (
    <div className="calendar-app">
      <div className={`calendar-container ${isNotePanelVisible ? 'shifted' : ''}`}>
        <h1 className="calendar-header">Calendario</h1>
        
        <Calendar
            onChange={onChange}
            value={date}
            tileContent={({ date }) => {
              const dateString = date.toDateString();
              const dayNotes = notes[dateString];
              return (
                <div className="note-container">
                  {dayNotes && dayNotes.map((note, index) => (
                    <span key={index} className="note">{note}</span>
                  ))}
                </div>
              );
            }}
            tileDisabled={({ date }) => date < new Date().setHours(0, 0, 0, 0)}
          />
      </div>

      {isNotePanelVisible && (
        <div className="note-panel visible">
          <button onClick={closeNotePanel} className="close-button">x</button>

          <div className="input-container">

          <input
            type="text"
            value={currentNote}
            onChange={(e) => setCurrentNote(e.target.value)}
            placeholder="Escribe tu nota aquí"
          />

       
            <button onClick={addNote} className="add-note-button">
              Agregar
            </button>
          </div>

          <ul className="note-list">
            {notes[date.toDateString()] ? (
              notes[date.toDateString()].map((note, index) => (
                <li key={index} className="note-item">
                  <span>{note.note}</span>
                  <button
                     onClick={() => deleteNote(date.toDateString(), note.noteId)}
                    className="delete-note-button"
                  >
                    Eliminar
                  </button>
                </li>
              ))
            ) : (
              <li className="note-item">No hay notas para este día</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Calendario;