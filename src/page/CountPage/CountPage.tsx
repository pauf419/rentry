import { observer } from "mobx-react-lite";
import { FC, useContext, useEffect, useState } from "react";
import m from "../RootPage/RootPage.module.sass"
import Footer from "../../component/Footer/Footer";
import {useParams } from "react-router-dom";
import { ctx } from "../..";
import { AxiosError } from "axios";
import TransformModal from "../../component/TransformModal/TransformModal"
import CronPanel from "../../component/CronPanel/CronPanel";


const CountPage:FC = () => {

    const {store} = useContext(ctx)
    const [editCode, setEditCode] = useState<string>("")
    const [isCodeInvalid, setIsCodeInvald] = useState<boolean>(false)
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const [error, setError] = useState<any>()
    const [dynamicUsersCount, setDynamicUsersCount] = useState<number>()

    const {id} = useParams()

    const setup = async (id:string) => {
        const resp = await store.setup(id)
        if(resp) setError(resp.data)
        localStorage.setItem("edit_code", "")
    }

    const getDynamicVisitorsCount = async () => {
        const count_resp = await store.getDynamicVisitorsCount(editCode)
        if(count_resp instanceof AxiosError) return setIsCodeInvald(true)
        setIsAuthorized(true)
        setDynamicUsersCount(count_resp.data.visitors)
    }

    useEffect(() => {
        setup(id!)
    }, [])

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
        <div className={m.StatsPageContainer}>
            {
                isAuthorized
                    ?
                    <>
                        <div className={`${m.VisitorsList} ${m.Extend} `}>
                            {
                                !dynamicUsersCount
                                    ?
                                    <div className={m.NoVisitsContainer}>
                                        There are no activity in the last 100 minutes yet...
                                    </div>
                                    :
                                    <div className={m.NoVisitsContainer}>
                                        Requests count in the last 100min: {dynamicUsersCount}
                                    </div>
                            }
                        </div>
                    </>
                    :
                    <div className={m.AuthWrapper}>
                        <div className={`${m.InputOutline} ${isCodeInvalid ? m.Active : m.Inactive}`}>
                            {isCodeInvalid ? <div>Edit Code invalid.</div> : ""}
                            <input type="text" required={true} placeholder="Enter edit code" onChange={e => setEditCode(e.target.value)}/>
                        </div>
                        <button className={m.Send} onClick={() => getDynamicVisitorsCount()}>
                            Send
                        </button>
                    </div>

            }
            <div className={m.Controlls}>
                <button className={m.VisitorParamBtn} onClick={() => window.location.href="/"+id}> 
                    ← Preview
                </button>
                {
                    isAuthorized
                        ?
                        <button className={m.VisitorParamBtn} onClick={() => getDynamicVisitorsCount()}> 
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"/>
                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466"/>
                            </svg>
                        </button>
                        :
                        <></>
                }
            </div>
            <Footer/>
        </div>
    )
}

export default observer(CountPage)