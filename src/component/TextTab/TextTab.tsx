import { observer } from "mobx-react-lite"
import { useContext, useEffect, useState } from "react";
import { ctx } from "../..";
import MDEditor from '@uiw/react-md-editor';
import React from "react";
import m from "./TextTab.module.sass"
import Markdown from "react-markdown";


const TextTab = () => {
    const { store } = useContext(ctx);

    return (
        <div className={m.TextTabWrapper}>
            <textarea onChange={(e) => store.setText(e.target.value)} value={store.text}></textarea>
        </div>
    );
}

export default observer(TextTab)