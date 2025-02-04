
import React, { useState, useEffect,useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash,faPenToSquare,faThumbsUp,faThumbsDown,faBroom } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from 'react-hot-toast';
import "./task.css";  
import { Button, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore,Mic } from "@mui/icons-material";
import { ScrollTop } from "../../components/common/scrollTop";
import useSound from 'use-sound';
import rayo from "../../assets/check.mp3"
import ok from "../../assets/digital.mp3"

// const serverFront = "http://localhost:3001";
const serverFront = 'https://calendariopropio.onrender.com';


export function Task() {
    const [tarea, setTarea] = useState([]);
    const [dia, setDia] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [mes,setMes] = useState("")
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
        if (dia.trim() && descripcion.trim() && mes.trim()) {
            axios.post(`${serverFront}/api/add-task`, { day: dia, description: descripcion, month:mes })
            .then(response => {
                setTarea(tarea => [...tarea, response.data]);
                setDia("");
                setMes("")
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
        setDia("")
        setMes("")
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



    // Eliminar todas las tareas
    const deleteAllTasks = () => {
        axios.delete(`${serverFront}/api/delete-task`)
            .then(response => {
                setTarea([]); 
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
        day:'',
        month:'',
        description:''
    })

    const editing = (tare) => {
        setEditId(tare._id);
        setEditingId({
            day:tare.day,
            month:tare.month,
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
    }, [descripcion, dia]);
    
    const iniciarReconocimiento = () => {
        if (recognition.current) {
            recognition.current.start();
        }
    };


    return (
        <div className="task-container">
            <h2> Tareas </h2> 
            <div className="task-input">

                <select onChange={(event) => setDia(event.target.value)} value={dia}>
                    <option value="">Seleccionar Día</option>
                    <option value="Lunes">Lunes</option>
                    <option value="Martes">Martes</option>
                    <option value="Miercoles">Miércoles</option>
                    <option value="Jueves">Jueves</option>
                    <option value="Viernes">Viernes</option>
                    <option value="Sabado">Sábado</option>
                    <option value="Domingo">Domingo</option>
                </select>

                <select
                 onChange={(event) => setMes(event.target.value)} value={mes}
                >
                    <option value=""><em>Seleccionar Mes  </em></option>
                    <option value="Enero">Enero</option>
                    <option value="Febrero">Febrero</option>
                    <option value="Marzo">Marzo</option>
                    <option value="Abril">Abril</option>
                    <option value="Mayo">Mayo</option>
                    <option value="Junio">Junio</option>
                    <option value="Julio">Julio</option>
                    <option value="Agosto">Agosto</option>
                    <option value="Septiembre">Septiembre</option>
                    <option value="Octubre">Octubre</option>
                    <option value="Noviembre">Noviembre</option>
                    <option value="Diciembre">Diciembre</option>
                </select>

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
                    
                    <button className="add-task" onClick={addTarea}>
                        Agregar
                    </button>

                    <button className="clean-task" onClick={cleanTask}>
                        Limpiar
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

            <div className="task-table">
                <div className="table-responsive">
                    <table>
                    <button onClick={deleteAllTasks} className="delete-all">Borrar Todo</button>
                        <tbody>
                            <Button
                                onClick={() => setShowInputs(!showInputs)}
                                startIcon={showInputs ? <ExpandLess /> : <ExpandMore />}
                                sx={{ margin: '2rem 0 0.2rem auto' }}> 
                                    {showInputs ? 'Cerrar Tareas' : 'Abrir Tareas'}
                            </Button>

                            <Collapse  in={showInputs} timeout="auto" unmountOnExit>
                                {tarea.map((element, index) => (
                                    <tr 
                                    key={index} 
                                    onClick={() => setActiveRow(activeRow === element._id ? null : element._id)} // Toggle la fila activa
                                    className={`row ${activeRow === element._id ? 'active' : ''}`}
                                >
                             <td className={`tareas-completas ${element.completed ? "completado" : "incompleto"}`}>
                           
                             {(activeRow === element._id || selectedTasks.includes(element._id)) && ( 
                                // Mostrar el checkbox si la fila está activa o si la tarea ya está seleccionada
                                <input
                                    className="check"
                                    type="checkbox"
                                    checked={selectedTasks.includes(element._id)}
                                    onChange={() => handleCheckboxChange(element._id)}
                                />
                            )}


                                <button
                                    className={element.completed ? "incompleto" : "completado"}
                                    onClick={() => tasksCompleted(element._id, element.completed)}
                                >
                                    <i className={element.completed ? "fas fa-check" : "fa-regular fa-circle"}></i>
                                </button>

                                
                            </td>
                                        
                                        <td>{editId === element._id ? ( <input value={editingId.day} onChange={(e) => setEditingId({...editingId, day:e.target.value})}/> ) : (element.day)}</td>
                                        <td>{editId === element._id ? ( <input value={editingId.month} onChange={(e) => setEditingId({...editingId, month:e.target.value})}/>) : (element.month)}</td>
                                        <td>{editId === element._id ? ( <input value={editingId.description} onChange={(e) => setEditingId({...editingId, description:e.target.value})}/>) : (element.description)}</td>
                                        
                                        <td className="bot">
                                            <button className="delete-task" onClick={() => deleteTarea(element._id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>

                                            {
                                                editId === element._id ? (
                                                    <div className="edits-tareas">
                                                        <button className="up" onClick={() => saveTasks(element._id)}>
                                                            <FontAwesomeIcon icon={faThumbsUp}/>
                                                        </button>
                                                        <button className="down" onClick={cancelEdit}>
                                                            <FontAwesomeIcon icon={faThumbsDown}/>
                                                        </button>
                                                        
                                                    </div>
                                                ) : (
                                                    <button className="gear" onClick={() => editing(element)}>
                                                        <FontAwesomeIcon icon={faPenToSquare} />
                                                    </button>
                                                    
                                                )}
                                        </td>

                                    </tr>
                                ))}
                            </Collapse>
                        </tbody>
                    </table>
                </div>
            </div>
            <ScrollTop/>
            <Toaster/>
        </div>
    );
}
