import { FC, ReactNode } from "react";
import m from "./TransformModal.module.sass"
import { observer } from "mobx-react-lite";


interface TransformModalProps {
    active:boolean
    setActive:(x:boolean) => void
    children: ReactNode
}


const TransformModal:FC<TransformModalProps> = ({active, setActive, children}) => {



    return ( 
        <>
            <div className={`${m.TransformModalWrapper} ${active ? m.Active : m.Inactive}`}>
                {children}
            </div>
            <div className={`${m.Blurer} ${active ? m.Active : m.Inactive}`} onClick={() => setActive(false)}>

            </div>
        </>
    )
}

export default observer(TransformModal)