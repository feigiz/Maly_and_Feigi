import React, { useEffect, useState } from "react";
import trash from "../icons/trash.png"
import edit from "../icons/edit.png"
import { useContext } from "react";
import { AppContext } from "../App";
import useNextId from "./useNextId";

function Todos() {
    const { userDetails } = useContext(AppContext)
    const [originalTodos, setOriginalTodos] = useState([]);
    const [todos, setTodos] = useState([]);
    const [showAdditionForm, setShowAdditionForm] = useState(false);
    const [nextId, setNextId] = useNextId(2);
    const [searchType, setSearchType] = useState();

    useEffect(() => {
        // fetch(`http://localhost:3000/todos?userId=${userDetails.id}`)
        fetch(`http://localhost:8080/todos?userId=${userDetails.id}`)
            .then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();//איך?
            })
            .then(data => {
                setOriginalTodos(data);
                let todosArr = []
                for (let i = 0; i < data.length; i++)
                    todosArr.push({ ...data[i], originalIndex: i, editable: false })
                setTodos(todosArr);
            }).catch(ex => alert(ex))
    }, [])

    function addTodo(event) {
        event.preventDefault();
        const newTodo = { userId: userDetails.id, id: `${nextId}`, title: event.target[0].value, completed: false }
        fetch('http://localhost:3000/todos', {
            method: 'POST',
            body: JSON.stringify(newTodo),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setOriginalTodos(prev => [...prev, newTodo])
            setTodos(prev => [...prev, { ...newTodo, originalIndex: originalTodos.length, editable: false }])
            setShowAdditionForm(false)
            setNextId(prevId => prevId + 1)
        }).catch((ex) => alert(ex));
    }

    function deleteTodo(originalIndex, i, id) {
        if (confirm('Are you sure you want to delete this todo from the database?')) {
            // fetch(`http://localhost:3000/todos/${id}`, {
            fetch(`http://localhost:8080/todos/${id}`, {
                method: 'DELETE'
            }).then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
            }).then(() => {
                setOriginalTodos((prev) => [...prev.slice(0, originalIndex), null, ...prev.slice(originalIndex + 1, prev.length)])
                setTodos((prev) => [...prev.slice(0, i), ...prev.slice(i + 1, prev.length)])
            }).catch((ex) => alert(ex));
        } else
            return;
    }

    function updateTodo(event, originalIndex, i, id) {
        event.preventDefault()
        const { title, completed } = event.target;
        const updatedTodo = { title: title.value, completed: completed.checked }
        fetch(`http://localhost:3000/todos/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedTodo),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setOriginalTodos(prev => [...prev.slice(0, originalIndex), { ...prev[originalIndex], ...updatedTodo }, ...prev.slice(originalIndex + 1, prev.length)])
            setTodos(prev => [...prev.slice(0, i), { ...prev[i], ...updatedTodo }, ...prev.slice(i + 1, prev.length)])
            changeEditable(i)
        }).catch((ex) => alert(ex));
    }

    function changeEditable(i) {
        setTodos(prev => [...prev.slice(0, i), { ...prev[i], editable: !prev[i].editable }, ...prev.slice(i + 1, prev.length)])
    }

    function sortTodos(event) {
        event.preventDefault()
        let sortArr = todos.slice()
        switch (event.target.value) {
            case "id": setTodos(sortArr.sort((a, b) => a.id - b.id)); break;
            case "alphabet": setTodos(sortArr.sort((a, b) => a.title > b.title ? 1 : -1)); break;
            case "completed": setTodos(sortArr.sort(a => a.completed ? -1 : 1)); break;
            case "random": setTodos(sortArr.sort(() => Math.random() > 0.5 ? -1 : 1)); break;
        }
    }

    function searchTodos(event) {
        let foundsArr, foundIndex;
        const { name, value } = event.target;
        switch (name) {
            case "id":
                foundIndex = originalTodos.findIndex(t => t != null && t.id == value)
                setTodos([{ ...originalTodos[foundIndex], originalIndex: foundIndex, editable: false }])
                break;
            case "title":
                foundsArr = originalTodos.map((t, i) => {
                    if (t != null && t.title.includes(value)) return { ...t, originalIndex: i, editable: false }
                })
                setTodos(foundsArr.filter(t => t != null))
                break;
            case "completed":
                foundsArr = originalTodos.slice().map((t, i) => {
                    if (t != null && `${t.completed}` == value) return { ...t, originalIndex: i, editable: false }
                })
                setTodos(foundsArr.filter(t => t != null))
                break;
        }
    }

    function selectSearchType(event) {
        let foundsArr;
        if (event.target.value == "all") {
            foundsArr = originalTodos.map((t, i) => { if (t != null) return { ...t, originalIndex: i, editable: false } })
            setTodos(foundsArr.filter(t => t != null));
            setSearchType();
        }
        else
            setSearchType(event.target.value);
    }

    return (<>
        <button onClick={() => (setShowAdditionForm(prev => !prev))}>Add todo</button>
        <br />

        {showAdditionForm && <form onSubmit={addTodo}>
            <label htmlFor='title' >todo title</label>
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
        <select onChange={selectSearchType} name="search">
            <option value="all" ></option>
            <option value="id">id</option>
            <option value="title">title</option>
            <option value="completed">completed</option>
        </select>
        <br />

        {searchType ?
            (searchType == "completed" ? <>
                <label htmlFor="completed">completed</label>
                <input type="radio" name="completed" value="true" onChange={event => searchTodos(event)} />
                <label htmlFor="notCompleted">not completed</label>
                <input type="radio" name="completed" value="false" onChange={event => searchTodos(event)} />
            </> : <input type="text" name={searchType} onChange={event => searchTodos(event)} />)
            : <></>}

        <h1><ins>Todos list</ins></h1>
        {todos.length == 0 ? <h2>No todos found</h2>
            : todos.map((todo, i) => {
                return (todo.id > -1 ?
                    <form className="todosContainer" key={i} onSubmit={(event) => { updateTodo(event, todo.originalIndex, i, todo.id) }}>
                        <span>{todo.id}: </span>
                        {todo.editable ? <>
                            <input name="title" type="text" defaultValue={todo.title} className="titleInput" />
                            <input name="completed" type="checkbox" defaultChecked={todo.completed} /></>
                            : <><span>{todo.title} </span>
                                <input name="completed" type="checkbox" disabled={true} checked={todo.completed} /></>}
                        <img src={edit} onClick={() => changeEditable(i)} />
                        <img onClick={() => deleteTodo(todo.originalIndex, i, todo.id)} src={trash} />
                        {todo.editable && <button type="submit" >Update</button>}
                    </form> : <h2>No todos found</h2>)
            })}</>)
}
export default Todos;