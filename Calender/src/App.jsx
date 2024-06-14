// import Agenda from "./components/Agenda";

import Calendario from "./components/calendario";
import { BrowserRouter, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { Notas } from "./components/notas";

export function App(){
    
    return(
        <>
        <BrowserRouter>
        <Routes>
            <Route path='/' element={<Calendario/>}> </Route>
            <Route path='/notas' element={<Notas/>}></Route>
        </Routes>
        </BrowserRouter>
        </>
    )
}