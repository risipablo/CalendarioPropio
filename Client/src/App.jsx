
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Notas } from "./pages/notas/notas"
import { Task } from "./pages/task/task"
import { Navbar } from "./components/navbar/navbar"
import Calender from "./pages/calendario/calendario"


export function App(){
    
    return(
        <>
        <BrowserRouter>
        <Navbar/>
        <Routes>
            <Route path="/" element={<Calender/>} />
            <Route path="/notes" element={<Notas/>}></Route>
            <Route path="/task" element={<Task/>}></Route>
        </Routes>

        </BrowserRouter>
        </>
    )
}