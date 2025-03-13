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
import PaginationController from "../../component/PaginationController/PaginationController";
import ReactCountryFlag from "react-country-flag";
import MarkdownService from "../../service/MarkdownService";
import TransformModal from "../../component/TransformModal/TransformModal";


const PreviewPage:FC = () => {

    const {store} = useContext(ctx)
    const [editCode, setEditCode] = useState<string>("")
    const [isCodeInvalid, setIsCodeInvald] = useState<boolean>(false)
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const [error, setError] = useState<any>()
    const [visitorsModalActive, setVisitorsModalActive] = useState<boolean>(false)
    const [visitors, setVisitors] = useState<IVisitor[]>([])
    const [pagesAvailable, setPagesAvailable] = useState<number>(1)
    const [activePage, setActivePage] = useState<number>(0)
    const [offset, setOffset] = useState<number>(0)

    const {id} = useParams()
    const navigate = useNavigate();

    const setup = async (id:string) => {
        const resp = await store.setup(id)
        if(resp) setError(resp.data)
        localStorage.setItem("edit_code", "")
    }

    const getVisitors = async (_offset:number=offset) => {
        const count_resp = await store.getVisitorsCount(editCode)
        if(count_resp instanceof AxiosError) return setIsCodeInvald(true)
        const resp = await store.getVisitors(editCode, true, _offset, 50)
        if(resp instanceof AxiosError) return setIsCodeInvald(true)
        setPagesAvailable(Math.ceil(count_resp.data.visitors/50))
        setIsAuthorized(true)
        setVisitors(resp.data.visitors)
    }
    
    const handlePageChange = async (page:number) => {
        setOffset(50*page)
        setActivePage(page)
        await getVisitors(50*page)
        
    }

    useEffect(() => {
        setup(id!)
    }, [])

    const formatted_date = (mill: number) => {
        const padZero = (num: number) => (num < 10 ? '0' : '') + num;
    
        const d = new Date(mill);
        const year = d.getFullYear();
        const month = padZero(d.getMonth() + 1);
        const date = padZero(d.getDate());
        const hours = padZero(d.getHours());
        const minutes = padZero(d.getMinutes());
        const seconds = padZero(d.getSeconds());
    
        return `${date}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    }

    useEffect(() => {
        if(isCodeInvalid) setIsCodeInvald(false)
    }, [editCode])

    if(store.loading) return (
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

            <TransformModal active={visitorsModalActive} setActive={setVisitorsModalActive}>
                <div style={{paddingBottom: "1rem"}} className={`${m.VisitorsModal} ${visitorsModalActive ? m.Active : m.Inactive}`}>
                    <div className={m.VisitorsModalContent}>
                        {
                            isAuthorized
                                ?
                                <>
                                    <div className={m.VisitorsList}>
                                        {
                                            !visitors.length 
                                                ?
                                                <div className={m.NoVisitsContainer}>
                                                    There are no visits yet...
                                                </div>
                                                :
                                                ""
                                        }
                                        {visitors.map((v:IVisitor,i) => {
                                            return ( 
                                                <div className={m.VisitorWrapper}>
                                                    <div className={m.VisitorParam}>
                                                        {i}
                                                    </div>
                                                    <div className={m.Spacer}></div>
                                                    <div className={m.VisitorParam}>
                                                    <ReactCountryFlag svg countryCode={v.country} />
                                                    </div>
                                                    <div className={m.Spacer}></div>
                                                    <div className={m.VisitorParam}>
                                                        {v.ip}
                                                    </div>
                                                    <div className={m.Spacer}></div>
                                                    <div className={m.VisitorParam}>
                                                        {formatted_date(Number(v.timestamp))}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {
                                        visitors.length 
                                            ?
                                            <>
                                                <PaginationController pages={pagesAvailable} cb={(num) => handlePageChange(num)}/>
                                            </>
                                            :
                                            ""
                                    }
                                    <div className={m.BtnInner}>
                                        <button className={m.VisitorParamBtn} onClick={() => setVisitorsModalActive(false)}> 
                                            Close
                                        </button>
                                        <button className={m.VisitorParamBtn} onClick={() => handlePageChange(activePage)}> 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                                            </svg>
                                        </button>
                                    </div>
                                    
                                </>
                                :
                                <>
                                    <div className={`${m.InputOutline} ${isCodeInvalid ? m.Active : m.Inactive}`}>
                                        {isCodeInvalid ? <div>Edit Code invalid.</div> : ""}
                                        <input type="text" required={true} placeholder="Enter edit code" onChange={e => setEditCode(e.target.value)}/>
                                    </div>
                                    <div className={m.BtnBox}>
                                        <button className={m.Send} onClick={() => getVisitors()}>
                                            Send
                                        </button>
                                        <button onClick={() => setVisitorsModalActive(false)}> 
                                            Close
                                        </button>
                                    </div>
                                </>

                        }
                    </div>
                </div>
            </TransformModal>
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
                    <button className={`${m.GoBotn}`} onClick={() => window.location.href="/"+id+"/count"}>Last activity</button>
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