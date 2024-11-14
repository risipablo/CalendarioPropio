
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import toast, { Toaster } from 'react-hot-toast';
import "./task.css";  
import { Button, Collapse } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { ScrollTop } from "../../components/common/scrollTop";



// const serverFront = "http://localhost:3001";
const serverFront = 'https://calendariopropio.onrender.com';


export function Task() {
    const [tarea, setTarea] = useState([]);
    const [dia, setDia] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [mes,setMes] = useState("")
    const [showInputs,setShowInputs] = useState(false)

    useEffect(() => {
        axios.get(`${serverFront}/api/task`)
            .then(response => setTarea(response.data))
            .catch(err => console.log(err));
    }, []);

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
            })
            .catch(err => console.log(err));
        }
    };

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

    const tasksCompleted = (id,completed) => {
        axios.patch(`${serverFront}/api/task/${id}/completed`,{ completed: !completed })
        .then(response => {
            const tareaCompleted = tarea.map(tare => tare._id === id ? response.data : tare)
            setTarea(tareaCompleted)
        })
        .catch(err => console.error('error al actualizar tarea:', err))
    }

    const cleanTask = () =>{
        setDescripcion("")
        setDia("")
        setMes("")
    }

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

                <div className="acciones">
                    
                    <button className="add-task" onClick={addTarea}>
                        Agregar
                    </button>

                    <button className="clean-task" onClick={cleanTask}>
                        Limpiar
                    </button>

                </div>

            </div>

            <div className="task-table">
                <div className="table-responsive">
                    <table>
                        <tbody>
                            <Button
                                onClick={() => setShowInputs(!showInputs)}
                                startIcon={showInputs ? <ExpandLess /> : <ExpandMore />}
                                sx={{ margin: '2rem 0 0.2rem auto' }}> 
                                    {showInputs ? 'Cerrar Tareas' : 'Abrir Tareas'}
                            </Button>

                            <Collapse  in={showInputs} timeout="auto" unmountOnExit>
                                {tarea.map((element, index) => (
                                    <tr key={index}>
                                        <td className={`tareas-completas ${element.completed ? "completado" : "incompleto"}`}>
                                            <button
                                                className={element.completed ? "incompleto" : "completado"}
                                                onClick={() => tasksCompleted(element._id, element.completed)}
                                            >
                                                <i className={element.completed ? "fas fa-check" : "fa-regular fa-circle"}></i>
                                            </button>
                                        </td>
                                        <td>{element.day}</td>
                                        <td>{element.month}</td>
                                        <td>{element.description}</td>
                                        <td className="bot">
                                            <button className="delete-task" onClick={() => deleteTarea(element._id)}>
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
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
