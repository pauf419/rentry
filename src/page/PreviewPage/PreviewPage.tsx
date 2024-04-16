import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import m from "../RootPage/RootPage.module.sass"
import Footer from "../../component/Footer/Footer";
import Toolbar from "../../component/Toolbar/Toolbar";
import PreviewTab from "../../component/PreviewTab/PreviewTab";
import TextTab from "../../component/TextTab/TextTab";
import { useNavigate, useParams } from "react-router-dom";
import { ctx } from "../..";
import { AxiosError } from "axios";
import IVisitor from "../../interface/IVisitor";
import { Visitor } from "typescript";
import Dropdown from "../../component/Dropdown/Dropdown";


const PreviewPage:FC = () => {

    const {store} = useContext(ctx)
    const [editCode, setEditCode] = useState<string>("")
    const [isCodeInvalid, setIsCodeInvald] = useState<boolean>(false)
    const [error, setError] = useState<any>()
    const [visitorsModalActive, setVisitorsModalActive] = useState<boolean>(false)
    const [visitors, setVisitors] = useState<IVisitor[]>([])

    const {id} = useParams()
    const navigate = useNavigate();

    const setup = async (id:string) => {
        const resp = await store.setup(id)
        if(resp) setError(resp.data)
        localStorage.setItem("edit_code", "")
    }

    const getVisitors = async () => {
        const resp = await store.getVisitors(editCode)
        if(resp instanceof AxiosError) return setIsCodeInvald(true)
        setVisitors(resp.data.visitors)
        
    }

    useEffect(() => {
        setup(id!)
    }, [])

    const formatted_date = (mill:number) => {
        var result="";
        var d = new Date(mill);
        result += d.getFullYear()+"/"+(d.getMonth()+1)+"/"+d.getDate() + 
                    " "+ d.getHours()+":"+d.getMinutes()+":"+
                    d.getSeconds()
        return result;
    }

    useEffect(() => {
        if(isCodeInvalid) setIsCodeInvald(false)
    }, [editCode])

    if(store.loading) return (
        <div className={m.LoadingWrapper}>
            <div className={m.LoadingTitle}>
                <h1>YourApp</h1>
            </div>
            <div className={m.LoadingContent}>
                Loading...
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
            <div className={`${m.Blurer} ${visitorsModalActive ? m.Active : m.Inactive}`} onClick={e => setVisitorsModalActive(false)}>
                
            </div>
            <div className={`${m.VisitorsModal} ${visitorsModalActive ? m.Active : m.Inactive}`}>
                <div className={m.VisitorsModalContent}>
                    {
                        visitors.length 
                            ?
                            <div className={m.VisitorsList}>
                                {visitors.map((v:IVisitor,i) => {
                                    return (
                                        <div className={m.VisitorWrapper}>
                                            <div className={m.VisitorParam}>
                                                {i}
                                            </div>
                                            <div className={m.Spacer}></div>
                                            <div className={m.VisitorParam}>
                                                {v.country}
                                            </div>
                                            <div className={m.Spacer}></div>
                                            <div className={m.VisitorParam}>
                                                {v.ip}
                                            </div>
                                            <div className={m.Spacer}></div>
                                            <div className={m.VisitorParam}>
                                                {formatted_date(Number(store.markdown!.timestamp))}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            :
                            <>
                                <div className={`${m.InputOutline} ${isCodeInvalid ? m.Active : m.Inactive}`}>
                                    {isCodeInvalid ? <div>Edit Code invalid.</div> : ""}
                                    <input type="text" required={true} placeholder="Enter edit code" onChange={e => setEditCode(e.target.value)}/>
                                </div>
                                <button className={m.Send} onClick={() => getVisitors()}>
                                    Send
                                </button>
                            </>

                    }
                </div>
        
            </div>
            {
                store.markdown.edit_code && 
                    <div className={m.EditCodeContainer}>
                        <li>Your edit code: <span>{store.markdown.edit_code}</span></li>
                    </div>
            }
            <Toolbar tabs={[
                {
                    node: <PreviewTab/>,
                    title: "Preview"
                }
            ]}/>
            <div className={`${m.ToolbarFooter}`}>
                
                <div className={m.StartBlock}>
                    <button className={`${m.GoBtn}`} onClick={() => window.location.href="/"+id+"/edit"}>
                        Edit
                    </button>
                    <button className={`${m.GoBtn}`} onClick={() => window.location.href="/"}>
                        New
                    </button>
                    <button className={`${m.GoBotn}`} onClick={() => setVisitorsModalActive(true)}>Visitors</button>
                    <Dropdown onClick={() => window.location.href = "/" + id + "/raw"}/> 
                </div>
                
                <div className={m.EndBlock}>
                    <div className={m.Timestamp}>
                        <span>Pub:</span>
                        <span>{formatted_date(Number(store.markdown!.timestamp))}</span>
                    </div>
                    <div className={m.Views}>
                        <span>Views:</span>
                        <span>{store.markdown.visitors}</span>
                    </div>
                </div>
                
            </div>
            <Footer/>
        </div>
    )
}

export default observer(PreviewPage)