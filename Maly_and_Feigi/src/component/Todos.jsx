import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import trash from "../icons/trash.png"
import edit from "../icons/edit.png"
import { useContext } from "react";
import { AppContext } from "../App";

function Todos() {

    //לקצר את הפונקציה בסינאפ
    //לקצר מערך טודו קטן
    // IהI פייגי רוצה לסדר את עניני    
    // const { state } = useLocation();
    const [userTodos, setUserTodos] = useState([]);
    const [showAdditionForm, setShowAdditionForm] = useState(false);
    // const [editables, setEditables] = useState([]);
    const [todos, setTodos] = useState([]);
    // const [stringSearch, setStringSearch] = useState();
    const [nextId, setNextId] = useState();
    const [searchType, setSearchType] = useState();
    const {userDetailes}=useContext(AppContext)

    useEffect(() => {
        //fech next id
        fetch("http://localhost:3000/nextIDs/2")
            .then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();
            })
            .then((json) => {
                setNextId(json.nextId)
            }).catch(ex => alert(ex))

        //fech todos
        fetch(`http://localhost:3000/todos?userId=${userDetailes.id}`)
            .then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();
            })
            .then(data => {
                setUserTodos(data);
                // setUserTodos(data.map(todo => { return { ...todo, editables: false } }));
                let todosArr = []
                for (let i = 0; i < data.length; i++)
                    todosArr.push({ ...data[i], i: i, editable: false })
                setTodos(todosArr);
            }).catch(ex => alert(ex))
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
        const newTask = { userId: userDetailes.id, id: `${nextId}`, title: event.target[0].value, completed: false }
        fetch('http://localhost:3000/todos', {
            method: 'POST',
            body: JSON.stringify(newTask),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setUserTodos(prev => [...prev, newTask])
            setTodos(prev => [...prev, { ...newTask, i: userTodos.length, editable: false }])
            setShowAdditionForm(false)
            setNextId(prev => prev + 1)
        }).catch((ex) => alert(ex));
    }

    function deleteTask(userIndex, i, id) {
        if (confirm('Are you sure you want to delete this todo from the database?')) {
            fetch(`http://localhost:3000/todos/${id}`, {
                method: 'DELETE'
            }).then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
            }).then(() => {
                setUserTodos((prev) => [...prev.slice(0, userIndex), null, ...prev.slice(userIndex + 1, prev.length)])
                setTodos((prev) => [...prev.slice(0, i), ...prev.slice(i + 1, prev.length)])
            }).catch((ex) => alert(ex));
        } else {
            return;
        }
    }

    function changeEditable(i) {
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

    function updateTask(event, userIndex, i, id) {
        event.preventDefault()
        const { title, completed } = event.target;
        console.log(completed.checked)


        fetch(`http://localhost:3000/todos/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                title: title.value,
                completed: completed.checked
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setUserTodos(prev => [...prev.slice(0, userIndex), { ...prev[userIndex], title: title.value, completed: completed.value }, ...prev.slice(userIndex + 1, prev.length)])
            setTodos(prev => [...prev.slice(0, i), { ...prev[i], title: title.value, completed: completed.value }, ...prev.slice(i + 1, prev.length)])
            changeEditable(i)
        }).catch((ex) => alert(ex));
    }

    function searchTodos(event) {
        let foundsArr;
        let foundIndex;
        console.log(event.target.value)
        switch (event.target.name) {
            case "id":
                foundIndex = userTodos.findIndex(t => t != null && t.id == event.target.value)
                setTodos([{ ...userTodos[foundIndex], i: foundIndex, editable: false }])
                break;
            case "title":
                foundsArr = userTodos.map((t, i) => { if (t != null && t.title.includes(event.target.value)) return { ...t, i: i, editable: false } })
                setTodos(foundsArr.filter(t => t != null))
                break;
            case "searchBycompleted":
                foundsArr = userTodos.slice()
                    .map((t, i) => { if (t != null && `${t.completed}`==event.target.value) return { ...t, i: i, editable: false } })
                setTodos(foundsArr.filter(t => t != null))
                break;
        }
    }

    function search(event) {
        let foundsArr;
        if (event.target.value == "all") {
            foundsArr = userTodos.map((t, i) => { if (t != null) return { ...t, i: i, editable: false } })
            setTodos(foundsArr.filter(t => t != null));
            setSearchType();
        }
        else
            setSearchType(event.target.value);
        console.log(event.target.value)
    }
    return (<>
        <br /><br />
        <button onClick={() => (setShowAdditionForm(prev => !prev))}>Add task</button>
        <br />

        {showAdditionForm && <form onSubmit={addingTask}>
            <label htmlFor='title' >task title</label>
            <input name='title' type='text' required></input>
            <button type="submit">Add</button>
        </form>}

        <br />
        <label htmlFor='sort' >order by</label>
        <select onChange={sortTodos} name="sort">
            <option value="all" > </option>
            <option value="id">id</option>
            <option value="alphabet">alphabet</option>
            <option value="completed">completed</option>
            <option value="random">random</option>
        </select>

        <label htmlFor='search' >search by</label>
        <select onChange={search} name="search">
            <option value="all" onClick={searchTodos}></option>
            <option value="id">id</option>
            <option value="title">title</option>
            <option value="completed">completed</option>
        </select>
        <br />
        {searchType ? (searchType == "completed" ?
            <>
                <label htmlFor="completed">completed</label>
                <input type="radio" name="searchBycompleted" value="true" onChange={event => searchTodos(event)} />
                <label htmlFor="notCompleted">not completed</label>
                <input type="radio" name="searchBycompleted" value="false" onChange={event => searchTodos(event)} />
            </> : <input type="text" name={searchType} onChange={event => searchTodos(event)} />)
            : <></>}
        <h2> <ins>todos list</ins></h2>
        {todos.length == 0 ? <h2>There are no tasks</h2>
            : todos.map((todo, i) => {
                return (
                    <form key={i} onSubmit={(event) => updateTask(event, todo.i, i, todo.id)}>
                        <span style={{ marginRight: 10 }}>{todo.id}: </span>
                        {todo.editable ? <>
                            <input name="title" type="text" defaultValue={todo.title} style={{ width: 300 }} />
                            <input name="completed" type="checkbox" defaultChecked={todo.completed} /></>
                            : <><span>{todo.title} </span>
                                <input name="completed" type="checkbox" disabled={true} checked={todo.completed} /></>}
                        <img src={edit} onClick={() => changeEditable(i)} />
                        <img onClick={() => deleteTask(todo.i, i, todo.id)} src={trash} />
                        {todo.editable && <button type="submit" >update</button>}
                        <br /><br />
                    </form>)
            })}</>)
}

export default Todos;



// {/* <form onSubmit={searchTodos}>
// // <label htmlFor='searchById'>search by id</label>
// <input type="text" name="searchById" onChange={event => searchTodos(event.target)} />
// {/* <input type="text" name="searchById" /> */}
// {/* <label htmlFor='searchByTitle'>search by title</label> */}
// {/* <input type="text" name="searchByTitle" onChange={event => searchTodos(event.target)} /> */}
// {/* <input type="text" name="searchByTitle" /> */}
// {/* {/* <label htmlFor='searchBycompleted'>search by completed</label> */}
// {/* <input type="text" name="searchBycompleted" onChange={event => setStringSearch(event.target.value)} /> */} */}
// {/* <p>search by completed</p>
// <input type="radio" name="searchBycompleted" value="true" />
// <label htmlFor="completed">completed</label>
// <input type="radio" name="searchBycompleted" value="false" />
// <label htmlFor="notComplete">not complete</label> */}
// {/* <input onChange={event => searchTodos(event.target)} type="radio" name="searchBycompleted" value="all" />
// <label htmlFor="all">all</label> */}
// {/* <button type="submit">search</button> */}
// {/* <p>search by completed</p>
// <input type="radio" onChange={event => searchTodos(event.target)} name="searchBycompleted" value="true" />
// <label htmlFor="completed">completed</label>
// <input onChange={event => searchTodos(event.target)} type="radio" name="searchBycompleted" value="false" />
// <label htmlFor="notComplete">not complete</label> */}
// {/* <input onChange={event => searchTodos(event.target)} type="radio" name="searchBycompleted" value="all" />
// // <label htmlFor="all">all</label> */}
// {/* <br /> */}
// //     </form >
