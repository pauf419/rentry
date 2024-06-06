import { FC, useContext, useEffect, useState } from "react";
import m from "./CronPanel.module.sass"
import { observer } from "mobx-react-lite";
import MarkdownService from "../../service/MarkdownService";
import { ctx } from "../..";
import { AxiosError } from "axios";
import ICron from "../../interface/ICron";

interface ICronPanel {
    close: () => void
}

const CronPanel:FC<ICronPanel> = ({close}) => {

    const {store} = useContext(ctx)
    const [mills, setMills] = useState<number>()
    const [volume, setVolume] = useState(15);
    const [accessCode, setAccessCode] = useState<string>("")
    const [isAuthorized, setIsAuthorized] = useState<boolean>(false)
    const [isCodeInvalid, setIsCodeInvald] = useState<boolean>(false)
    const [cronConfig, setCronConfig] = useState<ICron | null>(null)
    const [error, setError] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)

    const verifyAuth = async () => {
        const data = await store.getCron(accessCode)
        if(data instanceof AxiosError) return setIsCodeInvald(true)
        setIsAuthorized(true)
        setCronConfig(data.data)
        setMills(data.data.min)
        setVolume(data.data.min/(24*60*60*1000))
    }

    const save = async () => {
        const data = await store.cron(accessCode, mills!)
        if(data instanceof AxiosError) {
            setError(true)
            return setTimeout(() => setError(false), 12000)
        }
        setSuccess(true)
        return setTimeout(() => setSuccess(false), 8000)

    }

    useEffect(() => {
        if(isCodeInvalid) setIsCodeInvald(false)
    }, [accessCode])

    useEffect(() => {
        setMills((24*60*60*1000)*volume)
    }, [volume])
    
    return (
        <div className={m.CronPanelWrapper}>
            {
                isAuthorized
                    ? 
                    <div className={m.CronPanelContent}>
                        <div className={m.StatusBox}>
                            {
                                error
                                    ?
                                    <div className={m.ErrorBox}>
                                            An error has occurred. Check the validity of the data or contact the developer!
                                    </div>
                                    :
                                    <></>
                            }
                            {
                                success   
                                    ?
                                    <div className={m.SuccessBox}>
                                        Data updated successfully.
                                    </div>
                                    :
                                    <></>
                            }
                        </div>
                        <div className={m.VolumeBox}>
                            Current deletion threshold: {volume} days
                        </div>
                        <input
                            type="range"
                            className={m.VolumeSlider}
                            min="10"
                            max="30"
                            value={volume}
                            onChange={(e:any) => setVolume(e.target.value)}
                        />
                        <div className={m.BtnBox}>
                            <button onClick={() => save()}> 
                                Save
                            </button>
                            <button onClick={() => close()}> 
                                Close
                            </button>
                        </div>
                    </div>
                    :
                    <div className={m.AuthWrapper}>
                        <div className={`${m.InputOutline} ${isCodeInvalid ? m.Active : m.Inactive}`}>
                            {isCodeInvalid ? <div>Access Code invalid.</div> : ""}
                            <input type="text" required={true} placeholder="Enter Access code" onChange={e => setAccessCode(e.target.value)}/>
                        </div>
                        <div className={m.BtnBox}>
                            <button className={m.Send} onClick={() => verifyAuth()}>
                                Send
                            </button>
                            <button onClick={() => close()}> 
                                Close
                            </button>
                        </div>
                    </div>
            }
        </div>
    )
}

export default observer(CronPanel)