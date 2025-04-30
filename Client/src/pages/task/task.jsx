
import React, { useState, useEffect,useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash,faPenToSquare,faThumbsUp,faThumbsDown,faBroom } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from 'react-hot-toast';
import "./task.css";  
import { Button, Collapse } from "@mui/material";
import { AddCircle, CleanHands, ExpandLess, ExpandMore,Mic } from "@mui/icons-material";
import { ScrollTop } from "../../components/common/scrollTop";
import useSound from 'use-sound';
import rayo from "../../assets/check.mp3"
import ok from "../../assets/digital.mp3"
import { Modal } from "../../components/common/modal/modal";
import { config } from "../../components/config/variables"

const serverFront = config.apiUrl; 


export function Task() {
    const [tarea, setTarea] = useState([]);
    const [date,setDate] = useState(() => {
        return localStorage.getItem('fecha' || "00-00-0000")
    })
    const [descripcion, setDescripcion] = useState("");
    const [showInputs,setShowInputs] = useState(false)
    const [activeRow, setActiveRow] = useState(null);
    const [play] = useSound(rayo)
    const [play2] = useSound(ok)

    useEffect(() => {
        axios.get(`${serverFront}/api/task`)
            .then(response => setTarea(response.data))
            .catch(err => console.log(err));
    }, [serverFront]);

    const addTarea = () => {
        if (date.trim() && descripcion.trim() ) {
            axios.post(`${serverFront}/api/add-task`, { date: date, description: descripcion })
            .then(response => {
                setTarea(tarea => [...tarea, response.data]);
                setDate("")
                setDescripcion("");
                toast.success('Tarea agregada con éxito', {
                    position: 'center-right',
                });
                play2()
            })
            .catch(err => console.log(err));
        }
    };

    // Limpiar inputs
    const cleanTask = () =>{
        setDescripcion("")
        setDate("")
    }

    
    // Eliminar una tarea a la vez
    const deleteTarea = (id) => {
        axios.delete(`${serverFront}/api/task/` + id)
            .then(response => {
                setTarea(tarea => tarea.filter((tare) => tare._id !== id))
                console.log("Task deleted successfully");
                toast.error('Tarea eliminada ', {
                    position: 'top-center',
                });
                
            })
            .catch(err => console.error("Error deleting task:", err));
    };


    

    const [selectedTasks, setSelectedTasks] = useState([]);
    
        // Manejar la selección de tareas
    const handleCheckboxChange = (id) => {
        setSelectedTasks((prev) => 
            prev.includes(id) ? prev.filter(taskId => taskId !== id) : [...prev, id]
        );
    };


    const deleteMultipleTareas = (ids) => {
        axios.delete(`${serverFront}/api/task`, { data: { ids } })
            .then(response => {
                setTarea(tarea => tarea.filter(tare => !ids.includes(tare._id)));
                setShowModal(false)
                console.log(response.data.message);
                toast.error(`${response.data.message}`, {
                    position: 'top-center',
                });
            })
            .catch(err => console.error("Error deleting tasks:", err));
    };

    const cleanManyTasks = () => {
        setSelectedTasks("")
    }


    const [showModal,setShowModal] = useState(false)

    const deleteAll = () => {
        setShowModal(true)
    }


    // Eliminar todas las tareas
    const deleteAllTasks = () => {
        axios.delete(`${serverFront}/api/delete-task`)
            .then(response => {
                setTarea([]); 
                setShowModal(false)
                toast.error('Todas las tareas eliminadas', {
                    position: 'top-center',
                });
            })
            .catch(err => {
                console.error("Error deleting tasks:", err);
                toast.error('Error al eliminar las tareas', {
                    position: 'top-center',
                });
            });
    };


    const tasksCompleted = (id, completed) => {
        axios.patch(`${serverFront}/api/task/${id}/completed`, { completed: !completed })
            .then(response => {
                
                const tareaActualizada = response.data;
                
                setTarea((prevTareas) =>
                    prevTareas.map((tare) =>
                        tare._id === id ? { ...tare, completed: tareaActualizada.completed } : tare
                    )
                );
                if (response.data.completed) {
                    play();
                    toast.success(`Nota completada `);
                } else {
                    toast.error(`Nota incompleta `);
                }
            })
            .catch(err => console.error('Error al actualizar tarea:', err));
    };

    // Edicion de tareas
    const [editId, setEditId] = useState(null);
    const [editingId, setEditingId] = useState({
        date:'',
        description:''
    })

    const editing = (tare) => {
        setEditId(tare._id);
        setEditingId({
            date:tare.date,
            description:tare.description
        })
    }

    const cancelEdit = () => {
        setEditId(null)
        setEditingId({
            day:'',
            month:'',
            description:''
        })
    }

    const saveTasks = (id) => {
        toast.promise(
            axios.patch(`${serverFront}/api/task/${id}`, editingId)
            .then(response => {
                setTarea(tarea.map(tare => tare._id === id ? response.data : tare))
                cancelEdit()
            })
            .catch(err => console.log(err)),
            {
                loading: 'Guardando...',
                success: <b>Tarea guardada!</b>,
                error: <b>No se pudo guardar.</b>,
            }
        )
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
    
            if (!descripcion) {
                setDescripcion(transcript); // tarea
            } else if (!dia) {
                setDia(transcript); // descripcion
            }
    
            // Si ambos campos están llenos, agrega la nota automáticamente
            if (descripcion.trim() && dia.trim()) {
                addTarea();
            }
        };
    }, [descripcion, date]);
    
    const iniciarReconocimiento = () => {
        if (recognition.current) {
            recognition.current.start();
        }
    };


    return (
        <div className="task-container">
            <h2> Tareas </h2> 
            <div className="task-input">

                <input type="date" placeholder="Ingresar Fecha"  value={date} onChange={(e) => setDate(e.target.value)}/>

                <input 
                    type="text" 
                    placeholder="Ingresar Tarea" 
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                />
            

            </div>

            <div className="acciones">
            <button className='mic' onClick={iniciarReconocimiento}>
                    <Mic/>
                </button>
                    <button className="agregar" onClick={addTarea}>
                        <AddCircle/>
                    </button>

                    <button className="limpiar" onClick={cleanTask}>
                        <CleanHands/>
                    </button>

            </div>

            <div className="container-manyproducts">
                    
                    {selectedTasks.length > 0 && (
                        <button onClick={() => deleteMultipleTareas(selectedTasks)} className="delete-many">
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                        )}
    
                        {selectedTasks.length > 0 && (
                            <button onClick={cleanManyTasks} className="broom">   <FontAwesomeIcon icon={faBroom} />  </button>
                        )}
            </div>

            <button className="eliminar-todo" onClick={deleteAll}> 
                    Borrar Todo
            </button>

            <tbody className="tareas-tablas">
                <Button
                 
                    onClick={() => setShowInputs(!showInputs)}
                    startIcon={showInputs ? <ExpandLess /> : <ExpandMore />}
                    sx={{ margin: '2rem 0 0.2rem auto' }}
                >
                    {showInputs ? 'Cerrar Tareas' : 'Abrir Tareas'}
                </Button>

                <Collapse in={showInputs} timeout="auto" className="collapse" unmountOnExit>
                    {tarea.map((element, index) => (
                        <React.Fragment key={index}> 
                            <tr 
                                className={element.completed ? "completed" : ""}
                                onClick={() => setActiveRow(activeRow === element._id ? null : element._id)}
                                
                            >
                                
                                <td > 
                                    {(activeRow === element._id || selectedTasks.includes(element._id)) && (
                                        
                                        <input
                                            
                                            type="checkbox"
                                            checked={selectedTasks.includes(element._id)}
                                            onChange={() => handleCheckboxChange(element._id)}
                                        />
                                    )}
                                    <button
                                        className="completed"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            tasksCompleted(element._id, element.completed);
                                        }}
                                    >
                                        <i className={element.completed ? "fas fa-check" : "fa-regular fa-circle"}></i>
                                    </button>
                                </td>

                               
                                <td>{element.date}</td>

                                
                                <td>{element.description}</td>

                              
                                <td>
                                    {editId === element._id ? (
                                        <div className="btn-edit">
                                            <button className="check" onClick={(e) => { e.stopPropagation(); saveTasks(element._id); }}>
                                                <FontAwesomeIcon icon={faThumbsUp} />
                                            </button>
                                            <button className="cancel" onClick={(e) => { e.stopPropagation(); cancelEdit(); }}>
                                                <FontAwesomeIcon icon={faThumbsDown} />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="acciones">
                                            <button className="editar" onClick={(e) => { e.stopPropagation(); editing(element); }}>
                                                <FontAwesomeIcon icon={faPenToSquare} />
                                            </button>
                                            <button className="eliminar" onClick={(e) => { e.stopPropagation(); deleteTarea(element._id); }}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>

                            
                            {editId === element._id && (
                                <tr className="edit-row">
                                    <td colSpan={4}>
                                        <div className="edit-inputs">
                                            <input
                                                type="date"
                                                value={editingId.date}
                                                onChange={(e) => setEditingId({ ...editingId, date: e.target.value })}
                                            />
                                            <input
                                                type="text"
                                                placeholder="Descripción"
                                                value={editingId.description}
                                                onChange={(e) => setEditingId({ ...editingId, description: e.target.value })}
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
            <Modal show={showModal} onClose={() => setShowModal(false)} onConfirm={deleteAllTasks}/>
        </div>
    );
}
