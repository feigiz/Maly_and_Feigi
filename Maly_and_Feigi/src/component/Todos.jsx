import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import trash from "../icons/trash.png"
import edit from "../icons/edit.png"

function Todos() {
    //מלי רוצה לשהתמש ביוס פהרהמפס

    const userDetailes = useLocation();
    // const [loading, setLoading] = useState();
    // const [getTodos, setGetTodos] = useState(true);
    const [userTodos, setUserTodos] = useState([]);
    const [showAdditionForm, setShowAdditionForm] = useState(false);
    // const [editables, setEditables] = useState([]);
    const [todos, setTodos] = useState(null);//הוספתי: המשימה שנמצאה
    const [stringSearch, setStringSearch] = useState();//הוספתי: המחרוזת לחיפוש
    const [nextId, setNextId] = useState();//הוספתי: נקסט אי די

    useEffect(() => {
        fetch("http://localhost:3000/nextIDs/2")
            .then((response) => response.json())
            .then((json) => {
                console.log(json.nextId)
                setNextId(json.nextId)
            });
    }, [])

    useEffect(() => {
        if (nextId != null)
            fetch("http://localhost:3000/nextIDs/2", {
                method: "PATCH",
                body: JSON.stringify({
                    "nextId": nextId
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            })
                .then((response) => response.json())
                .then((json) => console.log(json));
    }, [nextId])

    function addingTask(event) {
        event.preventDefault();
        const newTask = {
            userId: userDetailes.state.id, id: nextId,
            title: event.target[0].value, completed: false
        }
        setUserTodos(prev => [...prev, newTask])
        setTodos(prev => [...prev, { ...newTask, i: userTodos.length, editable: false }])
        setShowAdditionForm(false)
        setNextId(prev => prev + 1)
    }

    function submitChanges() {
        try {
            userTodos.map(todo =>
                fetch(`http://localhost:3000/todos`, {
                    method: 'POST',
                    // body: JSON.stringify({userTodos}),
                    body: JSON.stringify(todo),
                    // body: userTodos,
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                }).then(response => {
                    if (!response.ok) {
                        throw 'Error' + response.status + ': ' + response.statusText;
                    }
                    // alert("todos successfully updated");
                    // }).then(data => {

                    //     // navigate(`/home/users/${data.id}`);
                }));
            // fetch(`http://localhost:3000/todos?userId=${userDetailes.state.id}`, {
            //     // method: 'DELETE',
            // }).then(response => {
            //     if (!response.ok) {
            //         throw 'Error' + response.status + ': ' + response.statusText;
            //     }
            //     alert("todos successfully deleted");
            // });

        } catch (ex) { alert(ex); }
    }

    function changeCheckBox(userIndex, i) {
        setUserTodos(prev => [...prev.slice(0, userIndex), { ...prev[userIndex], completed: !prev[userIndex].completed }, ...prev.slice(userIndex + 1, prev.length)])
        // הוספתי: עדכון המשימה
        setTodos(prev => [...prev.slice(0, i), { ...prev[i], completed: !prev[i].completed }, ...prev.slice(i + 1, prev.length)])
    }

    function changeTitle(event, userIndex, i) {
        setUserTodos(prev => [...prev.slice(0, userIndex), { ...prev[userIndex], title: event.target.value }, ...prev.slice(userIndex + 1, prev.length)])
        // הוספתי: עדכון המשימה 
        setTodos(prev => [...prev.slice(0, i), { ...prev[i], title: event.target.value }, ...prev.slice(i + 1, prev.length)])
    }

    function deleteTask(userIndex, i) {
        setUserTodos((prev) => [...prev.slice(0, userIndex), null, ...prev.slice(userIndex + 1, prev.length)])
        // הוספתי: עדכון המשימה 
        setTodos((prev) => [...prev.slice(0, i), ...prev.slice(i + 1, prev.length)])
    }

    function allowEditing(i) {
        setTodos(prev => [...prev.slice(0, i), { ...prev[i], editable: !prev[i].editable }, ...prev.slice(i + 1, prev.length)])
    }

    function sortTodos(event) {
        event.preventDefault()
        let sortArr = todos.slice()
        switch (event.target.value) {
            case "id":
                setTodos(sortArr.sort((a, b) => a.id - b.id))
                break;
            case "alphabet":
                setTodos(sortArr.sort((a, b) => a.title > b.title ? 1 : -1))
                break;
            case "completed":
                setTodos(sortArr.sort(a => a.completed ? -1 : 1))
                break;
            case "random":
                setTodos(sortArr.sort(() => Math.random() > 0.5 ? -1 : 1))
                break;
        }
        console.log(userTodos)
    }


    //הוספתי : פונקצית החיפוש 
    function searchTodo(event) {
        event.preventDefault()
        let foundIndex
        let foundsArr
        switch (event.target.value) {
            case "all":
                foundsArr = userTodos.map((t, i) => { if (t != null) return { ...t, i: i, editable: false } })
                setTodos(foundsArr.filter(t => t != undefined));
                break;
            case "id":
                foundIndex = userTodos.findIndex(t => t != null && t.id == stringSearch)
                setTodos([{ ...userTodos[foundIndex], i: foundIndex, editable: false }])
                break;
            case "title":
                foundIndex = userTodos.findIndex(t => t != null && t.title == stringSearch)
                setTodos([{ ...userTodos[foundIndex], i: foundIndex, editable: false }])
                break;
            case "completed":
                foundsArr = userTodos.map((t, i) => { if (t != null && `${t.completed}` == stringSearch) return { ...t, i: i, editable: false } })
                setTodos(foundsArr.filter(t => t != undefined))
                break;
        }
    }

//אפשר לאחד עם השני?
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
                    let todosArr = []
                    for (let i = 0; i < data.length; i++)
                        todosArr.push({ ...data[i], i: i, editable: false })
                    setTodos(todosArr);
                })
            // setGetTodos(false)
        } catch (ex) { alert(ex); }

    }, [])

    // if (loading)
    // return (<><h1>Loading...</h1></>)//

    // else {
    return (<>
        {/* {console.log(userTodos)}
        {console.log(todos)} */}
        <br /><br />
        <button onClick={() => (setShowAdditionForm(prev => !prev))}>Add task</button>
        <button onClick={submitChanges}>Submit changes</button>
        <br />
        {showAdditionForm && <form onSubmit={addingTask}>
            <label htmlFor='title' >task title</label>
            <input name='title' type='text' required></input>
            <button type="submit">Add</button>
        </form>}
        <br />
        <label htmlFor='sort' >order by</label>
        <select onChange={sortTodos} name="sort">
            <option value="all"> </option>
            <option value="id">id</option>
            <option value="alphabet">alphabet</option>
            <option value="completed">completed</option>
            <option value="random">random</option>
        </select>


        {/* הוספתי : אינפוט וסלקט לחיפוש */}
        <label htmlFor='search' >search</label>
        <input type="text" name="search" onChange={event => setStringSearch(event.target.value)} />
        <label htmlFor='search' >by</label>
        <select onChange={searchTodo} name="search">
            <option value="all"></option>
            <option value="id">id</option>
            <option value="title">title</option>
            <option value="completed">completed</option>
        </select>


        <br />

        {userTodos.length == 0 ? <h2>There are no tasks</h2>
            : todos.map((todo, i) => {
                return (
                    (todo.i != -1 ?
                        <div key={i}>
                            <span>{todo.i + 1}. </span>
                            {todo.editable &&
                                <input type="text" defaultValue={todo.title} style={{ width: 300 }} onChange={(event) => changeTitle(event, todo.i, i)} />}
                            {!todo.editable &&
                                <span>{todo.title} </span>}
                            <input type="checkbox" disabled={!todo.editable} checked={todo.completed} onChange={() => changeCheckBox(todo.i, i)} />
                            {/* <input type="checkbox" disabled={!editables[i]} defaultChecked={todo.completed} onChange={() => changeCheckBox(i)} /> */}
                            <img src={edit} onClick={() => allowEditing(i)} />
                            <img onClick={() => deleteTask(todo.i, i)} src={trash} />
                            <br /><br />
                        </div> : <h4 key={i}>not found</h4>))
            })
        }</>)
    // }
}

export default Todos;