import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation, Form } from 'react-router-dom';
import trash from "../icons/trash.png"
import edit from "../icons/edit.png"

function Todos() {
    //מלי רוצה לשהתמש ביוס פהרהמפס


    const userDetailes = useLocation();
    // const [loading, setLoading] = useState();
    const [getTodos, setGetTodos] = useState(true);
    const [userTodos, setUserTodos] = useState([]);
    const [showForms, setShowForms] = useState({ addition: false, update: false });
    const [editable, setEditable] = useState([])

    function addingTask(event) {
        event.preventDefault();
        const newTask = {
            userId: userDetailes.state.id, id: `${userTodos.length + 1}`,
            title: event.target[0].value, completed: false
        }
        setUserTodos(prev => [...prev, newTask])
    }

    function submitChanges() {

    }

    function changeCheckBox(i) {
        setUserTodos(prev => {
            prev[i].completed = !prev[i].completed
            return prev;
        })
        console.log(userTodos)
    }

    function deleteTask(i) {
        setUserTodos(prev => {
            prev.splice(i, 1)
            return prev;
        })
        console.log(userTodos)
    }

    function updateTask(i) {

    }

    useEffect(() => {
        console.log(`get todos: ${getTodos}`)
        if (getTodos)
            try {
                // setLoading(true);
                fetch(`http://localhost:3000/todos?userId=${userDetailes.state.id}`)
                    .then(response => {
                        if (!response.ok)
                            throw 'Error' + response.status + ': ' + response.statusText;
                        // setLoading(false);
                        return response.json();
                    })
                    .then(data => {
                        setUserTodos(data);
                        // setUserTodos(data.map(todo => { return { ...todo, editable: false } }));
                        let temp=[]
                        for (let i = 0; i < data.length; i++)
                                temp.push(false)
                        setEditable(temp);
                    })
                setGetTodos(false)
            } catch (ex) { alert(ex); }

    }, [])

    // if (loading)
    // return (<><h1>Loading...</h1></>)//

    // else {
    return (<>
        <br /><br />
        <button onClick={() => (setShowForms(prev => { return { ...prev, addition: !prev.addition } }))}>Add task</button>
        <button onClick={submitChanges}>Submit changes</button>
        {showForms.addition && <form onSubmit={addingTask}>
            <label htmlFor='title' >task title</label>
            <input name='title' type='text' required></input>
            <button type="submit">Add</button>
        </form>}
        <br />
        {userTodos.length == 0 ? <h2>There are no tasks</h2> :
            userTodos.map((todo, i) => {
                return (
                <div key={i}>
                    <span>{i + 1}. </span>
                    {editable[i] && <input type="text" defaultValue={todo.title} style={{ width: 300 }} />}
                    {!editable[i] && <span>{todo.title} </span>}
                    <input type="checkbox" defaultChecked={todo.completed} onChange={() => changeCheckBox(i)} />
                    <img src={edit} onClick={() => { setEditable([...editable.splice(0,i),true,...editable.splice(i+1,editable.length)])}} />
                    <img src={trash} />
                    <br /><br />
                </div>)
            })
        }</>)
    // }
}

export default Todos;