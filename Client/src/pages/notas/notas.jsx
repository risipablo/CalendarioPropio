import { useState, useEffect, useRef } from "react";
import "./notas.css";
import axios from 'axios'
import { ScrollTop } from "../../components/common/scrollTop";
import { Button, Collapse } from '@mui/material';
import { ExpandLess, ExpandMore,AddCircle,Mic} from '@mui/icons-material';
import toast, { Toaster } from 'react-hot-toast';
import useSound from 'use-sound';
import check from "../../assets/check.mp3"
import ok from "../../assets/digital.mp3"



// const serverFront = "http://localhost:3001";
const serverFront = 'https://calendariopropio.onrender.com';

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
        axios.delete(`${serverFront}/api/acciones/` + id)
            .then(response => {
                setTasks(tasks => tasks.filter((task) => task._id !== id));
                toast.error('Tarea eliminada ', {
                    position: 'top-center',
                });
            })
            .catch(err => console.error("Error deleting task:", err));
    };


    const taskCompleted = (id, completed) => {
        axios.patch(`${serverFront}/api/acciones/${id}`, { completed: !completed })
            .then(response => {
                const taskCompleted = tasks.map(task => task._id === id ? response.data : task)
                setTasks(taskCompleted)
                play2()
                if(response.data.completed){
                    toast.success(`Nota completada `);
                   
                } else {
                    toast.error(`Nota incompleta `);
                }
            })
            .catch(err => console.error("Error updating task:", err));
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
        toast.promise(
            axios.patch(`${serverFront}/api/acciones/${id}`, editingId)
            .then(response => {
                setTasks(tasks.map(task => task._id === id ? response.data : task))
                cancelEdit()
            })
            .catch(err => console.log(err)),

            
        {
            loading: 'Guardando...',
            success: <b>Nota guardada!</b>,
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

                        <button className="agregar" onClick={addTask}>
                            <AddCircle/>
                        </button>
                    </div>
       
                </div>

                <div className="notas">
                    <table>
                        {/* <thead>
                            <tr>
                                <th>Tarea</th>
                                <th>Descripcion</th>
                                <th></th>
                            </tr>
                        </thead> */}
                        <tbody>
                            <Button
                                onClick={() => setShowInputs(!showInputs)}
                                startIcon={showInputs ? <ExpandLess /> : <ExpandMore />}
                                sx={{ margin: '2rem 0 0.2rem auto' }}
                            >
                                {showInputs ? 'Cerrar Notas' : 'Abrir Notas'}
                            </Button>

                            <Collapse in={showInputs} timeout="auto" unmountOnExit>
                                {tasks.map((element, index) => (
                                    <tr key={index} className={element.completed ? "completed" : ""}>
                                        <td className="notas-td">
                                            {editId === element._id ? (
                                                <input
                                                    className="descripcion"
                                                    value={editingId.task}
                                                    onChange={(e) => setEditingId({ ...editingId, task: e.target.value })}
                                                />
                                            ) : (
                                                element.task
                                            )}
                                        </td>

                                        <td className="descripcion">
                                            {editId === element._id ? (
                                                <input
                                                    value={editingId.descripcion}
                                                    onChange={(e) => setEditingId({ ...editingId, descripcion: e.target.value })}
                                                />
                                            ) : (
                                                element.descripcion
                                            )}
                                        </td>

                                        <td className="notas-buttons">
                                            <button
                                                className={element.completed ? "desmarcar" : "completar"}
                                                onClick={() => taskCompleted(element._id, element.completed)}
                                            >
                                                <i className={element.completed ? "fas fa-undo" : "fas fa-check"}></i>
                                            </button>
                                            <button onClick={() => deleteTask(element._id)} className="eliminar">
                                                <i className="fas fa-trash"></i>
                                            </button>

                                            {editId === element._id ? (
                                                <div className="btn-edit">
                                                    <button className="check" onClick={() => saveEdit(element._id)}>
                                                        <i class="fa-regular fa-thumbs-up"></i>
                                                    </button>
                                                    <button className="cancel" onClick={cancelEdit}>
                                                        <i className="fa-solid fa-ban"></i>
                                                    </button>
                                                </div>
                                            ) : (
                                                <button className="editar" onClick={() => editing(element)}>
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </Collapse>
                        </tbody>
                    </table>
                  </div>
                <ScrollTop/>
                <Toaster/>
            </div>
        </>
    );
}
