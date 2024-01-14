import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation, Form } from 'react-router-dom';

function Todos() {
    //מלי רוצה לשהתמש ביוס פהרהמפס
    useEffect(() => {
        try {
            setLoading(true);
            fetch(`http://localhost:3000/todos?userId=${userDetailes.state.id}`)
                .then(response => {
                    if (!response.ok)
                        throw 'Error' + response.status + ': ' + response.statusText;
                    setLoading(false);
                    return response.json();
                })
                .then(data => {
                    setUserTodos(data);
                    console.log(userTodos)

                })
        } catch (ex) { alert(ex); }

    }, [])
    
    const userDetailes = useLocation();
    const [loading, setLoading] = useState();
    const [userTodos, setUserTodos] = useState([]);
    const [additionForm, setAdditionForm] = useState(false);
    function addingTask(event) {
        const newTask = {
            userId: userDetailes.state.id, id: userTodos.length,
            title: event.target[0].value, completed: false
        }
        setUserTodos(prev => [...prev, newTask])
    }

    
    if (loading)
        return (<><h1>Loading...</h1></>)//

    else {
        return (<>
            <br /><br />
            <button onClick={() => (setAdditionForm(prev => !prev))}>Add task</button>
            {additionForm && <form onSubmit={addingTask}>
                <label htmlFor='title' >task title</label>
                <input name='title' type='text' required></input>
                <button type="submit">Add</button>
            </form>}
            <br />
            {userTodos.length == 0 ? <h2>There are no tasks</h2> :
                userTodos.map((todo, i) => {
                    return (<div key={i}>
                        <span>{i + 1}. {todo.title}</span>
                        <input type="checkbox" checked={todo.completed} />
                        <br /><br />
                    </div>)
                })
            }</>)
    }
}

export default Todos;