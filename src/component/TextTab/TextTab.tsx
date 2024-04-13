import { observer } from "mobx-react-lite"
import { useContext } from "react";
import { ctx } from "../..";
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const TextTab = () => {

    const markdown = `A paragraph with *emphasis* and **strong importance**.

    > A block quote with ~strikethrough~ and a URL: https://reactjs.org.
    
    * Lists
    * [ ] todo
    * [x] done
    
    A table:
    
    | a | b |
    | - | - |
    `

    const {store} = useContext(ctx);

    return (
        <div>TextTab: </div>
    )
}

export default observer(TextTab)