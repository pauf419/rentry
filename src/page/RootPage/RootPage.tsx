
import { observable, set } from "mobx"
import Footer from "../../component/Footer/Footer"
import How from "../../component/HowTav/How"
import PreviewTab from "../../component/PreviewTab/PreviewTab"
import TextTab from "../../component/TextTab/TextTab"
import Toolbar from "../../component/Toolbar/Toolbar"
import m from "./RootPage.module.sass"
import { observer } from "mobx-react-lite"
import { FC, FormEvent, useContext, useEffect, useState } from "react"
import { ctx } from "../.."
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom";


const RootPage:FC = () => {

    const {store} = useContext(ctx)

    const [customEditCode, setCustomEditCode] = useState<string>("")

    const uploadMarkdown = async () => {
        const {id, edit_code} = await store.uploadMarkdown(customEditCode)
        localStorage.setItem("edit_code", edit_code)
        window.location.href="/"+id
    }


    if(store.loading || !store.markdown) return (
        <div className={m.LoadingWrapper}>
            <div className={m.LoadingTitle}>
                <h1>Paste29</h1>
            </div>
            <div className={m.LoadingContent}>
                Is Loading...
            </div>
        </div>
    )

    return (
        <div className={m.RootPageContainer}>
            <Toolbar tabs={[
                {
                    node: <TextTab/>,
                    title: "Text"
                },
                {
                    node: <PreviewTab/>,
                    title: "Preview"
                }
            ]}/>
            <form className={`${m.ToolbarFooter}`}>
                
                <button className={`${m.GoBtn}`} onClick={() => uploadMarkdown()}>
                    Go
                </button>
                <div className={m.FooterInps}>
                    <input placeholder="Custom edit code" onChange={e => setCustomEditCode(e.target.value)}/>
                </div>
                
            </form>
            <Footer/>
        </div>
    )
}

export default observer(RootPage)