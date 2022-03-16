import React, { useState, useEffect } from 'react'
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

export default function NewsEditor(props) {
    const [editorState, seteditorState] = useState("")
    useEffect(() => {
        const html = props.content
        if (html !== undefined) {
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                seteditorState(editorState)
            }
        }

    }, [props.content])
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
                        if (editorState !== undefined) {
                            props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
                        }

                    }
                }
            />
        </div>
    )
}
