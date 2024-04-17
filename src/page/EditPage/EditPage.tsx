import { observable, set } from "mobx"
import Footer from "../../component/Footer/Footer"
import How from "../../component/HowTav/How"
import PreviewTab from "../../component/PreviewTab/PreviewTab"
import TextTab from "../../component/TextTab/TextTab"
import Toolbar from "../../component/Toolbar/Toolbar"
import m from "../RootPage/RootPage.module.sass"
import { observer } from "mobx-react-lite"
import { FC, FormEvent, useContext, useEffect, useState } from "react"
import { ctx } from "../.."
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { AxiosError } from "axios"

const EditPage:FC = () => {

    const {store} = useContext(ctx)
    const {id} = useParams()
    const navigate = useNavigate();
    const [error, setError] = useState<any>()
    const [editCode, setEditCode] = useState<string>("")
    const [isCodeInvalid, setIsCodeInvald] = useState<boolean>(true)
    const [newEditCode, setNewEditCode] = useState<string>("")

    const setup = async (id:string) => {
        const resp = await store.setup(id)
        if(resp) setError(resp.data)
        localStorage.setItem("edit_code", "")
    }

    const editMarkdown = async () => { 
        if(!editCode) return setIsCodeInvald(true)

        const resp = await store.editMarkdown(editCode, newEditCode)
        if(resp instanceof AxiosError) return setIsCodeInvald(true)
        const {id, edit_code} = resp
        localStorage.setItem("edit_code", edit_code)
        window.location.href = "/"+id
    }

    const deleteMarkdown = async() => {
        if(!editCode) return setIsCodeInvald(true)

        const resp = await store.delete(editCode)
        if(resp instanceof AxiosError) return setIsCodeInvald(true)
        window.location.href = "/"
    }  

    useEffect(() => {
        setup(id!)
    }, [])

    useEffect(() => {
        if(isCodeInvalid) setIsCodeInvald(false)
    }, [editCode])

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

    if(error) return (
        <div className={m.ErrorContainer}>
            <div>
                <h1>{error.status}</h1>
            </div>
            {error.msg}
            <Footer/>
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
            <div className={`${m.ToolbarFooter} ${m.Edit}`}>
                <div className={m.EditInps}>

                    <div className={`${m.InputOutline} ${isCodeInvalid ? m.Active : m.Inactive}`}>
                        {isCodeInvalid ? <div>Edit Code invalid.</div> : ""}
                        <input type="text" required={true} placeholder="Enter edit code" onChange={e => setEditCode(e.target.value)}/>
                    </div>
                    <input placeholder="New edit code - optional" onChange={e => setNewEditCode(e.target.value)}/>
                </div>
                <div className={m.EditBtns}>
                    <div className={m.StartBlock}>
                        <button type="submit" className={`${m.GoBtn} ${m.SaveBtn}`} onClick={() => editMarkdown()}>
                            Save
                        </button>
                        <button className={`${m.GoBtn}`} onClick={() => window.location.href="/"+id}>
                            Back
                        </button>
                    </div>
                    <button className={`${m.GoBtn} ${m.DeleteBtn}`} onClick={() => deleteMarkdown()}>
                        Delete
                    </button>
                </div>    
            </div>
            <Footer/>
        </div>
    )
}

export default observer(EditPage)