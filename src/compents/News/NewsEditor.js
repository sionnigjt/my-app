import React, { useState } from 'react'
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';


export default function NewsEditor(props) {
    const [editorState, seteditorState] = useState("")
    return (
        <div>
            <Editor

                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                //受控状态
                editorState={editorState}
                onEditorStateChange={(key) => {
                    seteditorState(key)
                }}
                //失去焦点时,转换成html
                onBlur={
                    () => {
                        //父组件调用
                        props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                    }
                }
            />
        </div>
    )
}
