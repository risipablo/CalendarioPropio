import React, { useState, useEffect, useRef } from "react";
import "./notas.css";
import axios from 'axios'
import { ScrollTop } from "../../components/common/scrollTop";
import { Button, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore,AddCircle,Mic} from '@mui/icons-material';
import { faTrash,faPenToSquare,faThumbsUp,faThumbsDown, faBroom } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from 'react-hot-toast';
import useSound from 'use-sound';
import check from "../../assets/check.mp3"
import ok from "../../assets/digital.mp3"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "../../components/common/modal/modal";
import {config} from "../../components/config/variables"

const serverFront = config.apiUrl;  




export function Notas() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewtasks] = useState("");
    const [newDescripcion, setNewDescrition] = useState("");
    const [showInputs,setShowInputs] = useState(false)
    const [play] = useSound(check)
    const [play2] = useSound(ok)
    

    useEffect(() => {
        
            axios.get(`${serverFront}/api/tareas`)
            .then(response => {
                setTasks(response.data);
            })
            .catch(err => console.log(err));
    }, [serverFront]);

    const addTask = () => {
        if (newTask.trim() && newDescripcion.trim()) {
            axios.post(`${serverFront}/api/add-tareas`, {
                task: newTask,
                descripcion: newDescripcion
            })
                .then(response => {
                    const nuevaTarea = response.data;
                    setTasks(tasks => [...tasks, nuevaTarea]);
                    setNewtasks("");
                    setNewDescrition("");
                    toast.success('Nota agregada con éxito', {
                        position: 'center-right',
                    });
                  play()
                })
                .catch(err => console.log(err));
        }
    };

    const deleteTask = (id) => {
        axios.delete(`${serverFront}/api/tareas/` + id)
            .then(response => {
                setTasks(tasks => tasks.filter((task) => task._id !== id));
                toast.error('Tarea eliminada ', {
                    position: 'top-center',
                });
            })
            .catch(err => console.error("Error deleting task:", err));
    };


    const taskCompleted = async (id, completed) => {
        try {
            const { data } = await axios.patch(`${serverFront}/api/tareas/${id}/completed`, {
                completed: !completed,
            });
    
            setTasks((prevTasks) =>
                prevTasks.map((task) => (task._id === id ? data : task))
            );
    
            play2();
            if (data.completed) {
                toast.success("Nota marcada como completada.");
            } else {
                toast.error("Nota marcada como incompleta.");
            }
        } catch (err) {
            console.error("Error al marcar como completada:", err);
        }
    };

    // Editar gastos
    const [editId, setEditId] = useState(null);
    const [editingId, setEditingId] = useState({
        task: '',
        descripcion: ''
    });



    const cancelEdit = () => {
        setEditId(null);
        setEditingId({
            task: '',
            descripcion: '',
        });
    }
    const editing = (task) => {
        setEditId(task._id);
        setEditingId({
            task: task.task,
            descripcion: task.descripcion,
        });
    }


    
    const saveTask = async (id) => {
        try {
            toast.loading('Guardando...', { id: 'saving' });
            const response = await axios.patch(`${serverFront}/api/tareas/${id}`, editingId);
            setTasks(tasks.map(task => task._id === id ? response.data : task));
            cancelEdit();
            toast.dismiss('saving');
            toast.success('Tarea guardada!', { id: 'saving' });
        } catch (err) {
            toast.dismiss('saving');
            toast.error('No se pudo guardar.', { id: 'saving' });
            console.log(err);
        }
    };

    const [showModal,setShowModal] = useState(false)
    const [activeRow, setActiveRow] = useState(null);

    const modalDelete = () => {
        setShowModal(true)
    }

    // Eliminar todos
    const deleteAll = () => {
        axios.delete(`${serverFront}/api/tareas`)
            .then(response => {
                setTasks([]);
                setShowModal(false)
                toast.success('Todas las tareas eliminadas', {
                    position: 'top-center',
                });
            })
            .catch(err => console.log(err));
    }

    const [selectedNotes, setSelectedNotes] = useState([]);

    const handleCheck = (id) => {
        setSelectedNotes((prev) => 
        prev.includes(id) ? prev.filter((noteId) => noteId !== id) : [...prev, id]
        );
    }

    const deleteMany = (ids) => {
        axios.delete(`${serverFront}/api/many-tareas`, { data: { ids } })
            .then(response => {
                setTasks(tasks => tasks.filter((task) => !ids.includes(task._id)));
                setSelectedNotes([]);
                toast.success('Tareas eliminadas', {
                    position: 'top-center',
                });
            })
            .catch(err => console.log(err));
    }

    const cleanMany = () => {
        setSelectedNotes("");
    }

    //Reconocimiento de voz
    const recognition = useRef(null);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        recognition.current = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.current.lang = 'es-ES'; // Idioma en español
        recognition.current.interimResults = false;
    
        recognition.current.onstart = () => {
            setLoading(true);
            toast.info("Hablando...", { position: "top-center" });
        };
    
        recognition.current.onend = () => {
            setLoading(false);
        };
    
        recognition.current.onresult = (event) => {
            const transcript = event.results[0][0].transcript.toLowerCase();
            toast.success(`Texto capturado: "${transcript}"`, { position: "top-center" });
    
            if (!newTask) {
                setNewtasks(transcript); // tarea
            } else if (!newDescripcion) {
                setNewDescrition(transcript); // descripcion
            }
    
            // Si ambos campos están llenos, agrega la nota automáticamente
            if (newTask.trim() && newDescripcion.trim()) {
                addTask();
            }
        };
    }, [newTask, newDescripcion]);
    
    const iniciarReconocimiento = () => {
        if (recognition.current) {
            recognition.current.start();
        }
    };
    
    // const detenerReconocimiento = () => {
    //     if (recognition.current) {
    //         recognition.current.stop();
    //     }
    // };
    

    return (
        <>
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
                            placeholder="Agregar descripción ...."
                            onChange={(event) => setNewDescrition(event.target.value)}
                            value={newDescripcion}
                        />
                 

                    <div className="botones-mic">
                        <button className='mic' onClick={iniciarReconocimiento} title="Dictar tarea y descripción">
                            <Mic/>
                        </button>

                        <button className="add" onClick={addTask}>
                            <AddCircle/>
                        </button>
                    </div>
       
                </div>

                <button className="eliminar-todo" onClick={modalDelete}> 
                    Borrar Todo
                </button>

                <div className="container-manyproducts">
                    {selectedNotes.length > 0 && (
                        <button onClick={() => deleteMany(selectedNotes)} className="delete-many">
                            <FontAwesomeIcon icon={faTrash}/>
                        </button>
                    )}

                    {selectedNotes.length > 0 && (
                        <button onClick={cleanMany} className="broom">
                            <FontAwesomeIcon icon={faBroom}/>
                        </button>
                    )}
                </div>


                        {/* <thead>
                            <tr>
                                <th>Tarea</th>
                                <th>Descripcion</th>
                                <th></th>
                            </tr>
                        </thead> */}
                        <tbody className="tareas-tablas">
                            <Button
                                onClick={() => setShowInputs(!showInputs)}
                                startIcon={showInputs ? <ExpandLess /> : <ExpandMore />}
                                sx={{ margin: '2rem 0 0.2rem auto' }}
                            >
                                {showInputs ? 'Cerrar Notas' : 'Abrir Notas'}
                            </Button>

                            <Collapse in={showInputs} timeout="auto" unmountOnExit>
                                {tasks.map((element, index) => (
                                    <React.Fragment key={index} >


                                    <tr  onClick={() => setActiveRow(activeRow === element._id ? null : element._id)}
                                            className={element.completed ? 'completed' : ''}
                                             >


                                        <div className="checkbox-container">

                                        {(activeRow === element._id || selectedNotes.includes(element._id)) && (
                                            
                                            <input
                                                className="check"
                                                type="checkbox"
                                                checked={selectedNotes.includes(element._id)}
                                                onChange={() => handleCheck(element._id)}
                                            />
                                        )}

                                        </div>
                                        
                

                                        <td className="notas-td">
                                            {element.task}
                                        </td>

                                        <td className="descripcion">
                                            {element.descripcion}
                                        </td>


                                        <td className="notas-acciones">
                                            <div className="acciones-botones">
                                                <button
                                                    className={element.completed ? "desmarcar" : "completar"}
                                                    onClick={() => taskCompleted(element._id, element.completed)}
                                                >
                                                    <i className={element.completed ? "fas fa-undo" : "fas fa-check"}></i>
                                                </button>

                                                {editId === element._id ? (
                                                    <div className="btn-edit">
                                                        <button className="check" onClick={(e) => { e.stopPropagation(); saveTask(element._id); }}>
                                                            <FontAwesomeIcon icon={faThumbsUp} />
                                                        </button>
                                                        <button className="cancel" onClick={(e) => { e.stopPropagation(); cancelEdit(); }}>
                                                            <FontAwesomeIcon icon={faThumbsDown} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button className="editar" onClick={(e) => { e.stopPropagation(); editing(element); }}>
                                                            <FontAwesomeIcon icon={faPenToSquare} />
                                                        </button>
                                                        <button className="eliminar" onClick={(e) => { e.stopPropagation(); deleteTask(element._id); }}>
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                        
                                    </tr>

                                    {editId === element._id && (
                                            <tr className="edit-row">
                                                <td colSpan={4}>
                                                    <div className="edit-inputs">
                                                        <input
                                                            type="text"
                                                            value={editingId.task}
                                                            onChange={(e) => setEditingId({ ...editingId, task: e.target.value })}
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Descripción"
                                                            value={editingId.descripcion}
                                                            onChange={(e) => setEditingId({ ...editingId, newDescripcion: e.target.value })}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))}
                            </Collapse>
                        </tbody>

                <ScrollTop/>
                <Toaster/>
                <Modal show={showModal} onClose={() => setShowModal(false)} onConfirm={deleteAll}/>
            </div>
        </>
    );
}
