import { observer } from "mobx-react-lite"
import { useContext } from "react"
import { ctx } from "../.."
import MDEditor from '@uiw/react-md-editor';
import m from "./PreviewTab.module.sass";

const PreviewTab = () => {
    const { store } = useContext(ctx)
    return (
        <div className={m.PreviewTabWrapper}>
            <textarea readOnly className={m.PreviewText} value={store.text}>
            </textarea>
        </div>
        
    )
}

export default observer(PreviewTab)