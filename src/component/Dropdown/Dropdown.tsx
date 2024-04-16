import { FC, useState } from "react"
import m from "./Dropdown.module.sass"

interface IDropdown {
    onClick: () => void
}

const Dropdown:FC<IDropdown> = ({onClick}) => {

    const [active, setActive] = useState<boolean>(false)

    return (
        <button className={`${m.DropdownContainer} ${active ?  m.Active : m.Inactive}`} onClick={() => setActive(!active)}>
            <div className={m.DropdownTitle}>
                Export 
            </div>
            <div className={m.DropdownContent}>
                <button className={m.DropdownBtn} onClick={() => onClick()}>
                    Raw
                </button>
            </div>
        </button>
    )
}

export default Dropdown