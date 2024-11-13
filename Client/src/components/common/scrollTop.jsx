import { useEffect, useState } from "react";
import { animateScroll as scroll} from "react-scroll";
import "./scrollTop.css"


export function ScrollTop(){

    const [visible,setVisible] = useState(false);

    const clickUp = () => {
        scroll.scrollToTop();
    }

    const toogleVisibility = () => {
        if (window.pageYOffset > window.innerHeight / 2) {
            setVisible(true)
        } else {
            setVisible(false)
        }
    }

    useEffect(() => {
        window.addEventListener('scroll', toogleVisibility)
        return() => {
            window.removeEventListener('scroll',toogleVisibility)
        }
    },[])

    return(
        <button  onClick={clickUp} style={{ display: visible ? 'block' : 'none' }} className="btn-volver-arriba">
                 <i className="fa-solid fa-up-long"></i>
        </button>
    )
}