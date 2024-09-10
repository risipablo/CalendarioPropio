import { useState, useEffect } from "react";
import axios from 'axios';
import "./notas.css";
import { NavLink } from "react-router-dom";

// const serverFront = "http://localhost:3001";
const serverFront = 'https://servermern-yurb.onrender.com';

export function Notas() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewtasks] = useState("");
    const [newDescripcion, setNewDescrition] = useState("");

    useEffect(() => {
        axios.get(`${serverFront}/tasks`)
            .then(response => {
                setTasks(response.data);
            })
            .catch(err => console.log(err));
    }, [serverFront]);

    const addTask = () => {
        if (newTask.trim() && newDescripcion.trim()) {
            axios.post(`${serverFront}/add-task`, {
                task: newTask,
                descripcion: newDescripcion
            })
                .then(response => {
                    const nuevaTarea = response.data;
                    setTasks(tasks => [...tasks, nuevaTarea]);
                    setNewtasks("");
                    setNewDescrition("");
                })
                .catch(err => console.log(err));
        }
    };

    const deleteTask = (id) => {
        axios.delete(`${serverFront}/delete-task/` + id)
            .then(response => {
                setTasks(tasks.filter((task) => task._id !== id));
            })
            .catch(err => console.log(err));
    };


    const taskCompleted = (id, completed) => {
        axios.patch(`${serverFront}/update-task/${id}`, { completed: !completed })
            .then(response => {
                const updatedTasks = tasks.map(task => task._id === id ? response.data : task);
                setTasks(updatedTasks);
            })
            .catch(err => console.log(err));
    };

    // Editar gastos
    const [editId, setEditId] = useState(null);
    const [editingId, setEditingId] = useState({
        task: '',
        descripcion: ''
    });

    const editing = (task) => {
        setEditId(task._id);
        setEditingId({
            task:task.task,
            descripcion:task.descripcion,
        });
    }


    const cancelEdit = () => {
        setEditId(null);
        setEditingId({
            task: '',
            descripcion: '',
        });
    }

    const saveEdit = (id) => {
        axios.patch(`${serverFront}/edit-task/${id}`, editingId)
        .then(response => {
            setTasks(tasks.map(task => task._id === id ? response.data : task))
            cancelEdit()
        })
        .catch(err => console.log(err))
    }

    return (
        <>
            <NavLink to="/">
                <button className="calendario">Calendario</button>
            </NavLink>
            <div className="nota">
                <h2>Notas adicionales</h2>
                <div className="nota-input">
                    <input
                        type="text"
                        placeholder="Agregar nueva tarea ...."
                        onChange={(event) => setNewtasks(event.target.value)}
                        value={newTask}
                    />
                    <input
                        type="text"
                        placeholder="Agregar descripcion ...."
                        onChange={(event) => setNewDescrition(event.target.value)}
                        value={newDescripcion}
                    />
                    <button className="agregar" onClick={addTask}>
                         Agregar
                    </button>
                </div>
                <div className="notas">
                    <table>
                        <thead>
                            <tr>
                                <th>Tarea</th>
                                <th>Descripcion</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((element, index) => (
                                <tr key={index} className={element.completed ? "completed" : ""}>

                                    <td c>{editId === element._id ?
                                    <input lassName="descripcion"  value={editingId.task} onChange={(e) => setEditingId({...editingId, task: e.target.value})} />: element.task}</td>

                                    <td > {editId === element._id ?
                                    <input lassName="descripcion"  value={editingId.descripcion} onChange={(e) => setEditingId({...editingId, descripcion: e.target.value})} />: element.descripcion}</td>

                                    <td className="notas-buttons">
                                        <button
                                            className={element.completed ? "desmarcar" : "completar"}
                                            onClick={() => taskCompleted(element._id, element.completed)}
                                        >
                                            <i className={element.completed ? "fas fa-undo" : "fas fa-check"}></i>
                                            {element.completed ? " Desmarcar" : " Completar"}
                                        </button>
                                        <button onClick={() => deleteTask(element._id)} className="eliminar">
                                            <i className="fas fa-trash"></i> 
                                        </button>

                                                                            
                                    {editId === element._id ? (
                                    <div className='btn-edit'>
                                        <button className="check" onClick={() => saveEdit(element._id)}><i className="fa-solid fa-check"></i></button>
                                        <button className="cancel" onClick={cancelEdit}><i className="fa-solid fa-ban"></i></button>

                                    </div>
                                        ) : (
                                            <button className="editar" onClick={() => editing(element)}>
                                            <i className="fas fa-edit"></i> 
                                        </button>
                                        )}
  
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}


// <div className="move">
//                                     <button onClick={() => taksUp(index)}> ☝️ </button>
//                                     <button onClick={() => taksDown(index)}> 👇 </button>
//                                     </div>