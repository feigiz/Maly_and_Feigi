import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import trash from "../icons/trash.png"
import edit from "../icons/edit.png"


// function Comments(){
//     console.log("its the comments!")
// }

function Comments() {
    //לקצר את הפונקציה בסינאפ
    //לקצר מערך טודו קטן
    // IהI פייגי רוצה לסדר את עניני    
    const { state } = useLocation();
    const [userComments, setUserComments] = useState([]);
    const [showAdditionForm, setShowAdditionForm] = useState(false);
    // const [editables, setEditables] = useState([]);
    const [comments, setComments] = useState([]);
    // const [stringSearch, setStringSearch] = useState();
    const [nextId, setNextId] = useState();
    const [searchType, setSearchType] = useState();

    useEffect(() => {
        //fech next id
        fetch("http://localhost:3000/nextIDs/4")
            .then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();
            })
            .then((json) => {
                setNextId(json.nextId)
            }).catch(ex => alert(ex))

        //fech comments
        fetch(`http://localhost:3000/comments?postId=${state.post.id}`)
            .then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();
            })
            .then(data => {
                setUserComments(data);
                // setUserComments(data.map(comment => { return { ...comment, editables: false } }));
                let commentsArr = []
                for (let i = 0; i < data.length; i++)
                    commentsArr.push({ ...data[i], i: i, editable: false })
                setComments(commentsArr);
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
        const newTask = { userId: userDetailes.state.id, id: `${nextId}`, title: event.target[0].value, completed: false }
        fetch('http://localhost:3000/comments', {
            method: 'POST',
            body: JSON.stringify(newTask),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setUserComments(prev => [...prev, newTask])
            setComments(prev => [...prev, { ...newTask, i: userComments.length, editable: false }])
            setShowAdditionForm(false)
            setNextId(prev => prev + 1)
        }).catch((ex) => alert(ex));
    }

    // function submitChanges() {
    //     try {
    //         userComments.map(comment =>
    //             fetch(`http://localhost:3000/comments`, {
    //                 method: 'POST',
    //                 // body: JSON.stringify({userComments}),
    //                 body: JSON.stringify(comment),
    //                 // body: userComments,
    //                 headers: {
    //                     'Content-type': 'application/json; charset=UTF-8',
    //                 },
    //             }).then(response => {
    //                 if (!response.ok) {
    //                     throw 'Error' + response.status + ': ' + response.statusText;
    //                 }
    //                 // alert("comments successfully updated");
    //                 // }).then(data => {

    //                 //     // navigate(`/home/users/${data.id}`);
    //             }));
    //         // fetch(`http://localhost:3000/comments?userId=${userDetailes.state.id}`, {
    //         //     // method: 'DELETE',
    //         // }).then(response => {
    //         //     if (!response.ok) {
    //         //         throw 'Error' + response.status + ': ' + response.statusText;
    //         //     }
    //         //     alert("comments successfully deleted");
    //         // });

    //     } catch (ex) { alert(ex); }
    // }

    // function changeCheckBox(userIndex, i) {
    //     setUserComments(prev => [...prev.slice(0, userIndex), { ...prev[userIndex], completed: !prev[userIndex].completed }, ...prev.slice(userIndex + 1, prev.length)])
    //     // הוספתי: עדכון המשימה
    //     setComments(prev => [...prev.slice(0, i), { ...prev[i], completed: !prev[i].completed }, ...prev.slice(i + 1, prev.length)])
    // }

    // function changeTitle(event, userIndex, i) {
    //     setUserComments(prev => [...prev.slice(0, userIndex), { ...prev[userIndex], title: event.target.value }, ...prev.slice(userIndex + 1, prev.length)])
    //     // הוספתי: עדכון המשימה 
    //     setComments(prev => [...prev.slice(0, i), { ...prev[i], title: event.target.value }, ...prev.slice(i + 1, prev.length)])
    // }

    function deleteTask(userIndex, i, id) {
        if (confirm('Are you sure you want to delete this comment from the database?')) {
            fetch(`http://localhost:3000/comments/${id}`, {
                method: 'DELETE'
            }).then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
            }).then(() => {
                setUserComments((prev) => [...prev.slice(0, userIndex), null, ...prev.slice(userIndex + 1, prev.length)])
                setComments((prev) => [...prev.slice(0, i), ...prev.slice(i + 1, prev.length)])
            }).catch((ex) => alert(ex));
        } else {
            return;
        }
    }

    function changeEditable(i) {
        setComments(prev => [...prev.slice(0, i), { ...prev[i], editable: !prev[i].editable }, ...prev.slice(i + 1, prev.length)])
    }

    function sortComments(event) {
        event.preventDefault()
        let sortArr = comments.slice()
        switch (event.target.value) {
            case "id":
                setComments(sortArr.sort((a, b) => a.id - b.id))
                break;
            case "alphabet":
                setComments(sortArr.sort((a, b) => a.title > b.title ? 1 : -1))
                break;
            case "completed":
                setComments(sortArr.sort(a => a.completed ? -1 : 1))
                break;
            case "random":
                setComments(sortArr.sort(() => Math.random() > 0.5 ? -1 : 1))
                break;
        }
        console.log(userComments)
    }

    function updateTask(event, userIndex, i, id) {
        event.preventDefault()
        const { title, completed } = event.target;
        console.log(completed.checked)


        fetch(`http://localhost:3000/comments/${id}`, {
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
            setUserComments(prev => [...prev.slice(0, userIndex), { ...prev[userIndex], title: title.value, completed: completed.value }, ...prev.slice(userIndex + 1, prev.length)])
            setComments(prev => [...prev.slice(0, i), { ...prev[i], title: title.value, completed: completed.value }, ...prev.slice(i + 1, prev.length)])
            changeEditable(i)
        }).catch((ex) => alert(ex));
    }

    function searchComments(event) {
        let foundsArr;
        let foundIndex;
        console.log(event.target.value)
        switch (event.target.name) {
            case "id":
                foundIndex = userComments.findIndex(t => t != null && t.id == event.target.value)
                setComments([{ ...userComments[foundIndex], i: foundIndex, editable: false }])
                break;
            case "title":
                foundsArr = userComments.map((t, i) => { if (t != null && t.title.includes(event.target.value)) return { ...t, i: i, editable: false } })
                setComments(foundsArr.filter(t => t != null))
                break;
            case "searchBycompleted":
                foundsArr = userComments.slice()
                    .map((t, i) => { if (t != null && t.completed) return { ...t, i: i, editable: false } })
                setComments(foundsArr.filter(t => t != null))
                break;
            case "notComplete":
                foundsArr = userComments.map((t, i) => { if (t != null && !t.completed) return { ...t, i: i, editable: false } })
                setComments(foundsArr.filter(t => t != null))
                break;
        }
    }

    function search(event) {
        let foundsArr;
        if (event.target.value == "all") {
            foundsArr = userComments.map((t, i) => { if (t != null) return { ...t, i: i, editable: false } })
            setComments(foundsArr.filter(t => t != null));
            setSearchType();
        }
        else
            setSearchType(event.target.value);
        console.log(event.target.value)
    }
    return (<>
        <br /><br />
        <button onClick={() => (setShowAdditionForm(prev => !prev))}>Add task</button>
        {/* <button onClick={submitChanges}>Submit changes</button> */}
        <br />

        {showAdditionForm && <form onSubmit={addingTask}>
            <label htmlFor='title' >task title</label>
            <input name='title' type='text' required></input>
            <button type="submit">Add</button>
        </form>}

        <br />
        <label htmlFor='sort' >order by</label>
        <select onChange={sortComments} name="sort">
            <option value="all" > </option>
            <option value="id">id</option>
            <option value="alphabet">alphabet</option>
            <option value="completed">completed</option>
            <option value="random">random</option>
        </select>

        <label htmlFor='search' >search by</label>
        <select onChange={search} name="search">
            <option value="all" onClick={searchComments}></option>
            <option value="id">id</option>
            <option value="title">title</option>
            <option value="completed">completed</option>
        </select>
        <br />
        {searchType ? (searchType == "completed" ?
            <>
                <label htmlFor="completed">completed</label>
                <input type="radio" name="searchBycompleted" value="true" onChange={event => searchComments(event)} />
                <label htmlFor="notCompleted">not completed</label>
                <input type="radio" name="searchBycompleted" value="false" onChange={event => searchComments(event)} />
            </> : <input type="text" name={searchType} onChange={event => searchComments(event)} />)
            : <></>}
        <h2> <ins>comments list</ins></h2>
        {comments.length == 0 ? <h2>There are no tasks</h2>
            : comments.map((comment, i) => {
                return (
                    <form key={i} onSubmit={(event) => updateTask(event, comment.i, i, comment.id)}>
                        <span style={{ marginRight: 10 }}>{comment.id}: </span>
                        {comment.editable ? <>
                            <input name="title" type="text" defaultValue={comment.title} style={{ width: 300 }} />
                            <input name="completed" type="checkbox" defaultChecked={comment.completed} /></>
                            : <><span>{comment.title} </span>
                                <input name="completed" type="checkbox" disabled={true} checked={comment.completed} /></>}
                        <img src={edit} onClick={() => changeEditable(i)} />
                        <img onClick={() => deleteTask(comment.i, i, comment.id)} src={trash} />
                        {comment.editable && <button type="submit" >update</button>}
                        <br /><br />
                    </form>)
            })}</>)
}

export default Comments;








