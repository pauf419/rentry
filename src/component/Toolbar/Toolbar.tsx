import { FC, useEffect, useState } from "react";
import ITab from "../../interface/ITab";
import m from "./Toolbar.module.sass"

interface IToolbarProps {
    tabs: ITab[]
}

const Toolbar:FC<IToolbarProps> = ({tabs}) => {

    const [activeTab, setActiveTab] = useState<number>(0)
    const [disableCounter, setDisableCounter] = useState<number>(0)

    useEffect(() => {
        setTimeout(() => {
            setDisableCounter(activeTab)
        }, 200)
    }, [activeTab])

    return (
        <div className={m.ToolbarWrapper}>
            <div className={m.ToolbarHeader}>
                {tabs.map((tab:ITab, i:number) => <div onClick={() => setActiveTab(i)} key={tab.title} className={`${m.ToolbarButton} ${activeTab === i ? m.ButtonFocus : m.ButtonDefault}`}>
                    {tab.title}
                </div>)}
            </div>
            <div className={m.ToolbarContent}>
                {tabs.map((tab:ITab, i:number) => <div style={{display: disableCounter === i ? "":"none"}} key={tab.title} className={`${m.TabWrapper} ${activeTab === i ? m.TabFocus : m.TabDefault}`}>
                    {tab.node}
                </div>)}
            </div>
        </div>
    )

}

export default Toolbar