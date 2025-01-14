// import React, { useState, useEffect } from 'react';
// import Calendar from 'react-calendar';
// import 'react-calendar/dist/Calendar.css';
// import './calendario.css';
// import axios from 'axios';
// import toast, { Toaster } from 'react-hot-toast';

// // const serverFront = "http://localhost:3001";
// const serverFront = 'https://calendariopropio.onrender.com';

// const Calendario = () => {
//   const [date, setDate] = useState(new Date());
//   const [notes, setNotes] = useState({});
//   const [currentNote, setCurrentNote] = useState('');
//   const [isNotePanelVisible, setNotePanelVisible] = useState(false);

//   // Cargar notas desde el backend al iniciar
//   useEffect(() => {
//     axios.get(`${serverFront}/api/notes`)
//       .then(response => setNotes(response.data))
//       .catch(err => console.error(err));
//   }, []);

//   // Manejar el cambio de fecha y mostrar el panel de notas
//   const onChange = (newDate) => {
//     setDate(newDate);
//     setNotePanelVisible(true);
//   };

//   // Añadir una nueva nota
//   const addNote = () => {
//     const dateString = date.toDateString();
    
//     if (currentNote.trim()) {
//       const newTask = {
//         date: dateString,
//         note: currentNote.trim()
//       };
  
//       axios.post(`${serverFront}/api/add-notes`, newTask)
//         .then(response => {
//           console.log('Nota añadida:', response.data);
//           return axios.get(`${serverFront}/api/notes`);
//         })
//         .then(response => {
//           setNotes(response.data); // Actualiza todas las notas
//           setCurrentNote(''); // Limpia el input
//         })
//         .catch(err => console.error('Error al agregar nota:', err));
//     }
//   };
  
//   const deleteNote = (noteId) => {
//     axios.delete(`${serverFront}/api/notes/${noteId}`)
//       .then(response => {
//         console.log('Nota eliminada:', response.data);
//         return axios.get(`${serverFront}/api/notes`);
//       })
//       .then(response => {
//         setNotes(response.data);
//       })
//       .catch(err => console.error('Error al eliminar nota:', err));
//   };

//   // Cerrar el panel de notas
//   const closeNotePanel = () => {
//     setNotePanelVisible(false);
//   };

//   return (
//     <div className="calendar-app">
//       <div className={`calendar-container ${isNotePanelVisible ? 'shifted' : ''}`}>
//         <h1 className="calendar-header">Calendario</h1>
        
//         <Calendar
//           onChange={onChange}
//           value={date}
//           tileContent={({ date }) => {
//             const dateString = date.toDateString();
//             const dayNotes = notes[dateString];
//             return (
//               <div className="note-container">
//                 {Array.isArray(dayNotes) && dayNotes.map((note, index) => (
//                   <span key={index} className="note">{note}</span>
//                 ))}
//               </div>
//             );
//           }}
//           tileDisabled={({ date }) => date < new Date().setHours(0, 0, 0, 0)}
//         />
//       </div>

//       {isNotePanelVisible && (
//         <div className="note-panel visible">
//           <button onClick={closeNotePanel} className="close-button">x</button>

//           <div className="input-container">
//             <input
//               type="text"
//               value={currentNote}
//               onChange={(e) => setCurrentNote(e.target.value)}
//               placeholder="Escribe tu nota aquí"
//             />
//             <button onClick={addNote} className="add-note-button">
//               Agregar
//             </button>
//           </div>

//           <ul className="note-list">
//             {Array.isArray(notes[date.toDateString()]) && notes[date.toDateString()].length > 0 ? (
//               notes[date.toDateString()].map((note, index) => (
//                 <li key={index} className="note-item">
//                   <span>{note}</span>
//                   <button
//                     onClick={() => deleteNote(note._id)} // Asegúrate de pasar el identificador único de la nota
//                     className="delete-note-button"
//                   >
//                     Eliminar
//                   </button>
//                 </li>
//               ))
//             ) : (
//               <li className="note-item">No hay notas para este día</li>
//             )}
//           </ul>
//         </div>
//       )}
//       <Toaster />
//     </div>
//   );
// };

// export default Calendario;
