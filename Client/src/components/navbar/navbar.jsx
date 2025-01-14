
import { useState } from "react"
import { NavLink } from "react-router-dom"
import './navbar.css'
import { User } from "../user/user"

export function Navbar(){

    const [isopen,setisOpen] = useState(false)

    const toggleMenu = () => {
        setisOpen(!isopen)
        document.body.classList.toggle('open',!isopen)
    }

    const closeToggle = () => {
        setisOpen(false)
        document.open.classList.remove('open')
    }

    return(
        <nav>
            <div className="container-navbar">
                <div className="navbar">
                    

                    <div  className={`menu ${isopen ? 'open' : ''}`}>
                    <User/>
                    
                        <NavLink to="/" onClick={closeToggle}>
                            Calendario
                        </NavLink>
                        <NavLink to="/notes" onClick={closeToggle}>
                            Notas
                        </NavLink>
                        <NavLink to="/task" onClick={closeToggle}>
                            Tareas
                        </NavLink>

                        <NavLink >
                        Cerrar Sesion
                        </NavLink>


                    </div>

                    <div onClick={toggleMenu} className={`menu-icon ${isopen ? 'open' : ''}`}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    
                </div>
            </div>
        </nav>
    )
}