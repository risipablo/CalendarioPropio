

import imagenPrueba from "../../assets/prueba.jpg"
import "./user.css"

export function User(){


    return(
        <div className="container-user">

            <div className="container-image">
                <img src={imagenPrueba} alt="" />
            </div>
            
            <h2> Usuario </h2>

        </div>
    )
}