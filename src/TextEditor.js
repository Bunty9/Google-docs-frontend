import React, { useCallback } from 'react'
import {useEffect , useRef} from 'react'
import Quill from "quill"
import "./quill.snow.css";

const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
]

function TextEditor() {
    const wrapperRef =  useCallback((wrapper) => {
        if (wrapper==null) {return;}
        wrapper.innerHTML = ""
        const editor = document.createElement('div')
        wrapper.append(editor)
        new Quill(editor, {theme: "snow" , modules: {toolbar: TOOLBAR_OPTIONS}} )

    }, [])
    
    return (
        <div className = "container" ref={wrapperRef}>        </div>
    )
}

export default TextEditor
