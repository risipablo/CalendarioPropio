
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Calendario from "./pages/calendario/calendario"
import { Notas } from "./pages/notas/notas"
import { Task } from "./pages/task/task"
import { Navbar } from "./components/navbar/navbar"

export function App(){
    
    return(
        <>
        <BrowserRouter>
        <Navbar/>
        <Routes>
            <Route path='/' element={<Calendario/>}></Route>
            <Route path="/notes" element={<Notas/>}></Route>
            <Route path="/task" element={<Task/>}></Route>
        </Routes>
        </BrowserRouter>
        </>
    )
}