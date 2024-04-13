import { observer } from "mobx-react-lite"
import { useContext, useEffect, useState } from "react";
import { ctx } from "../..";
import MDEditor from '@uiw/react-md-editor';
import React from "react";
import m from "./TextTab.module.sass"
import Markdown from "react-markdown";


const TextTab = () => {
    const { store } = useContext(ctx);

    const [value, setValue] = React.useState<string>("SDSDS")


    return (
        <div className={m.TextTabWrapper}>
            <MDEditor
                value={store.text}
                onChange={(e) => store.setText(e!) as any}
                preview="edit"
                height="100%"
                style={{
                    background: "transparent",
                    borderRadius: "0",
                }}
                textareaProps={{
                    placeholder: 'Please enter Markdown text',
                }}
            />
        </div>
    );
}

export default observer(TextTab)