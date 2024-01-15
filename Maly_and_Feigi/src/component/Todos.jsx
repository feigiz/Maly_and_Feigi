import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation, Form } from 'react-router-dom';
import trash from "../icons/trash.png"
import edit from "../icons/edit.png"

function Todos() {
    //מלי רוצה לשהתמש ביוס פהרהמפס

    const userDetailes = useLocation();
    // const [loading, setLoading] = useState();
    // const [getTodos, setGetTodos] = useState(true);
    const [userTodos, setUserTodos] = useState([]);
    const [showAdditionForm, setShowAdditionForm] = useState(false);
    const [editables, seteditables] = useState([]);
    const [todo, setTodo] = useState(null);

    function addingTask(event) {
        event.preventDefault();
        const newTask = {
            userId: userDetailes.state.id, id: `${userTodos.length + 1}`,
            title: event.target[0].value, completed: false
        }
        setUserTodos(prev => [...prev, newTask])
        setShowAdditionForm(false)
    }

    function submitChanges() {
        try {
            // fetch(`http://localhost:3000/todos?userId=${userDetailes.state.id}`, {
            //     method: 'PUT',
            //     // body: JSON.stringify({userTodos}),
            //     body: JSON.stringify(userTodos),
            //     // body: userTodos,
            //     headers: {
            //         'Content-type': 'application/json; charset=UTF-8',
            //     },
            // }).then(response => {
            //     if (!response.ok) {
            //         throw 'Error' + response.status + ': ' + response.statusText;
            //     }
            //     alert("todos successfully updated");
            //     // }).then(data => {

            //     //     // navigate(`/home/users/${data.id}`);
            // });
            fetch(`http://localhost:3000/todos?userId=${userDetailes.state.id}`, {
                // method: 'DELETE',
            }).then(response => {
                if (!response.ok) {
                    throw 'Error' + response.status + ': ' + response.statusText;
                }
                alert("todos successfully deleted");
            });

        } catch (ex) { alert(ex); }
    }

    function changeCheckBox(i) {
        setUserTodos(prev => [...prev.slice(0, i), { ...prev[i], completed: !prev[i].completed }, ...prev.slice(i + 1, prev.length)])
    }

    function deleteTask(i) {
        setUserTodos((prev) => [...prev.slice(0, i), ...prev.slice(i + 1, prev.length)])
    }

    function allowEditing(i) {
        seteditabless(prev => [...prev.slice(0, i), !prev[i], ...prev.slice(i + 1, prev.length)])
    }

    function sortTodos(event) {
        event.preventDefault()
        let sortArr = userTodos.slice()
        switch (event.target.value) {
            case "id":
                setUserTodos(sortArr.sort((a, b) => a.id - b.id))
                break;
            case "alphabet":
                setUserTodos(sortArr.sort((a, b) => a.title > b.title ? 1 : -1))
                break;
            case "completed":
                setUserTodos(sortArr.sort(a => a.completed ? -1 : 1))
                break;
            case "random":
                setUserTodos(sortArr.sort(() => Math.random() > 0.5 ? -1 : 1))
                break;
        }
        console.log(userTodos)
    }


    useEffect(() => {
        // if (getTodos)
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
                    // setUserTodos(data.map(todo => { return { ...todo, editables: false } }));
                    let temp = []
                    for (let i = 0; i < data.length; i++)
                        temp.push(false)
                    seteditables(temp);
                })
            // setGetTodos(false)
        } catch (ex) { alert(ex); }

    }, [])

    // if (loading)
    // return (<><h1>Loading...</h1></>)//

    // else {
    return (<>
        {console.log(userTodos)}
        <br /><br />
        <button onClick={() => (setShowAdditionForm(prev => !prev))}>Add task</button>
        <button onClick={submitChanges}>Submit changes</button>
        <br />
        <label htmlFor='sort' >order by</label>
        <select onChange={sortTodos} name="sort">
            <option value="id">id</option>
            <option value="alphabet">alphabet</option>
            <option value="completed">completed</option>
            <option value="random">random</option>
        </select>

        <select onChange={searchTodo} name="sort">
            <option value="id">id</option>
            <option value="title">title</option>
            <option value="completed">completed</option>
            <option value="all">all</option>
        </select>

        {showAdditionForm && <form onSubmit={addingTask}>
            <label htmlFor='title' >task title</label>
            <input name='title' type='text' required></input>
            <button type="submit">Add</button>
        </form>}

        <br />

        {todo == null ? (userTodos.length == 0 ? <h2>There are no tasks</h2> :
            userTodos.map((todo, i) => {
                return (
                    <div key={i}>
                        <span>{i + 1}. </span>
                        {editables[i] && <input type="text" defaultValue={todo.title} style={{ width: 300 }} />}
                        {!editables[i] && <span>{todo.title} </span>}
                        <input type="checkbox" disabled={!editables[i]} checked={todo.completed} onChange={() => changeCheckBox(i)} />
                        {/* <input type="checkbox" disabled={!editables[i]} defaultChecked={todo.completed} onChange={() => changeCheckBox(i)} /> */}
                        <img src={edit} onClick={() => allowEditing(i)} />
                        <img onClick={() => deleteTask(i)} src={trash} />
                        <br /><br />
                    </div>)
            }))
            : <div>
                {editables[i] && <input type="text" defaultValue={todo.title} style={{ width: 300 }} />}
                {!editables[i] && <span>{todo.title} </span>}
                <input type="checkbox" disabled={!editables[i]} checked={todo.completed} onChange={() => changeCheckBox(i)} />
                {/* <input type="checkbox" disabled={!editables[i]} defaultChecked={todo.completed} onChange={() => changeCheckBox(i)} /> */}
                <img src={edit} onClick={() => allowEditing(i)} />
                <img onClick={() => deleteTask(i)} src={trash} />
                <br /><br />
            </div>
        }</>)
    // }
}

export default Todos;