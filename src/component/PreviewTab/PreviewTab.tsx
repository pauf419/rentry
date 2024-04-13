import { observer } from "mobx-react-lite"
import { useContext } from "react"
import { ctx } from "../.."
import MDEditor from '@uiw/react-md-editor';
import m from "./PreviewTab.module.sass";

const PreviewTab = () => {
    const { store } = useContext(ctx)
    return (
        <MDEditor.Markdown className={m.text} source={store.text} style={{ background: "transparent", color: "white"}} />

    )
}

export default observer(PreviewTab)