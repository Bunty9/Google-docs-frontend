import React, { useCallback } from 'react'
import {useEffect , useState} from 'react'
import Quill from "quill"
import "./quill.snow.css";
import io from "socket.io-client"
import { useParams , useHistory  } from "react-router-dom"

const SAVE_INTERVAL_MS = 5000;
const TOOLBAR_OPTIONS = [
    ['omega'],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
    ['delta'],
]

const ENDPOINT = "https://google-docs-backend.herokuapp.com"

function TextEditor() {
    const { id: documentId} = useParams()
    const [socket,setSocket] = useState()
    const [quill,setQuill] = useState() 
    const history = useHistory();

    useEffect(() =>{
        const s = io(ENDPOINT, {
            path: "/",
            withCredentials: true,
          });
        setSocket(s)
        return ()=>{
            s.disconnect();
        }
    },[])


    useEffect(() =>{
        if (socket == null || quill == null) return;
        socket.once('load-document', data =>{
            quill.setContents(data)
            quill.enable()
        })
        socket.emit('get-document',documentId)
    },[socket,quill , documentId])

    useEffect(() =>{
        if (socket == null || quill == null) return;
        const handler = function(delta, oldDelta, source) {
                if (source !== 'user') {
                return
                }
                socket.emit('send-changes',delta)
        }
        quill.on('text-change', handler)
        return ()=>{
            quill.off('text-change', handler )
        }
    },[socket,quill])

    
    useEffect(() =>{
        if (socket == null || quill == null) return;
        const handler = function(delta) {
            quill.updateContents(delta)
        }
        socket.on('receive-changes', handler)
        return ()=>{
            socket.off('receive-changes', handler )
        }
    },[socket,quill])

    
    useEffect(() =>{
        if (socket == null || quill == null) return;
        const interval = setInterval(() =>{
            socket.emit("save-document", quill.getContents())
        },SAVE_INTERVAL_MS)
        return ()=>{
            clearInterval(interval)
        }
    },[socket,quill])





    const wrapperRef =  useCallback((wrapper) => {
        if (wrapper==null) {return;}
        wrapper.innerHTML = ""
        const editor = document.createElement('div')
        wrapper.append(editor)
        const q = new Quill(editor, {theme: "snow" , modules: {toolbar: TOOLBAR_OPTIONS}} )

        var customButton1 = document.querySelector('.ql-omega');
        customButton1.addEventListener('click', function() {
            console.log("clicked")
            window.location = "https://github.com/Bunty9";
        });
        var customButton2 = document.querySelector('.ql-delta');
        customButton2.addEventListener('click', function(res) {
            console.log("clicked")
            history.push(`/`);
        });
        q.enable(false)
        q.setText("Loading . . . ")
        setQuill(q)
    }, [history])
    



    return (
            <div className = "container" ref={wrapperRef}>       
            </div>
    )
}

export default TextEditor


