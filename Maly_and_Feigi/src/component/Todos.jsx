import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation, Form } from 'react-router-dom';

function Todos() {
    //מלי רוצה לשהתמש ביוס פהרהמפס


    const userDetailes = useLocation();
    // const [loading, setLoading] = useState();
    const [userTodos, setUserTodos] = useState([]);
    const [showForms, setShowForms] = useState({ addition: false, update: false });

    function addingTask(event) {
        const newTask = {
            userId: userDetailes.state.id, id: `${userTodos.length + 1}`,
            title: event.target[0].value, completed: false
        }
        setUserTodos(prev => [...prev, newTask])
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
        try {
            // setLoading(true);
            console.log(userTodos)
            fetch(`http://localhost:3000/todos?userId=${userDetailes.state.id}`)
                .then(response => {
                    if (!response.ok)
                        throw 'Error' + response.status + ': ' + response.statusText;
                    // setLoading(false);
                    return response.json();
                })
                .then(data => {
                    setUserTodos(data);
                    console.log(userTodos)
                })
        } catch (ex) { alert(ex); }

    }, [])

    // if (loading)
    // return (<><h1>Loading...</h1></>)//

    // else {
    return (<>
        <br /><br />
        <button onClick={() => (setShowForms(prev => { return { ...prev, addition: !prev.addition } }))}>Add task</button>
        {showForms.addition && <form onSubmit={addingTask}>
            <label htmlFor='title' >task title</label>
            <input name='title' type='text' required></input>
            <button type="submit">Add</button>
        </form>}
        {showForms.update && <form onSubmit={(event)=>updateTask(event,i)}>
                        <label htmlFor='title' >task title</label>
                        <input name='title' type='text' required></input>
                        <button type="submit">update</button>
                    </form>}
        <br />
        {userTodos.length == 0 ? <h2>There are no tasks</h2> :
            userTodos.map((todo, i) => {
                return (<div key={i}>
                    <span>{i + 1}. </span>
                    <input type="text" defaultValue={todo.title}/>
                    <input type="checkbox" defaultChecked={todo.completed} onChange={() => changeCheckBox(i)} />
                    <button onClick={() => (setShowForms(prev => { return { ...prev, update: !prev.update } }))} >update</button>
                    <button onClick={() => deleteTask(i)}>delete</button>
                    <br /><br />
                </div>)
            })
        }</>)
    // }
}

export default Todos;