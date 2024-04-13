import { observer } from "mobx-react-lite"
import { useContext, useState } from "react";
import { ctx } from "../..";
import MDEditor from '@uiw/react-md-editor';
import React from "react";
import m from "./TextTab.module.sass"
import Markdown from "react-markdown";


const TextTab = () => {
    const { store } = useContext(ctx);

    return (
        <div className="container">
            <textarea className={m.Textarea} onChange={(e) => store.setText(e.target.value)} value={store.text} />
        </div>
    );
}

export default observer(TextTab)