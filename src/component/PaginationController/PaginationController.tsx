import { FC, useEffect, useState } from "react"
import m from "./PaginationController.module.sass"

interface PaginationControllerProps {
    pages: number
    cb: (page:number) => void
}

const PaginationController:FC<PaginationControllerProps> = ({pages, cb}) => {

    const [active, setActive] = useState<number>(0)
    const [leftDisabled, setLeftDisabled] = useState<boolean>(true)
    const [rightDisabled, setRightDisabled] = useState<boolean>(false)
    
    const handleClick = (page:number) => {
        setActive(page)
        cb(page)
    }

    useEffect(() => {
        if(pages===0) {
            setRightDisabled(false)
            setLeftDisabled(false)
            return;
        }
        if((active+1) === pages) setRightDisabled(true)
        else setRightDisabled(false)
        if(active === 0) setLeftDisabled(true)
        else setLeftDisabled(false)
    }, [active, pages])

    return ( 
        <div className={m.PaginationControllerWrapper}>
            <button className={m.PaginationControllerBtn} disabled={leftDisabled} onClick={() => handleClick(active-1)}>
                ←
            </button>
            {
                [...Array(pages)].map((page:number, i) => 
                <button className={m.PaginationControllerBtn} disabled={active === i} onClick={() => handleClick(i)}>
                    {i}
                </button>)
            }
            <button className={m.PaginationControllerBtn} disabled={rightDisabled} onClick={() => handleClick(active+1)}>
                →
            </button>
        </div>
    )
}

export default PaginationController