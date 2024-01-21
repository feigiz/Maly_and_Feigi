import React, { useContext, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import trash from "../icons/trash.png"
import edit from "../icons/edit.png"
import { AppContext } from "../App";


function Comments() {
    const { state } = useLocation();
    const [userComments, setUserComments] = useState([]);
    const [showAdditionForm, setShowAdditionForm] = useState(false);
    const [comments, setComments] = useState([]);
    const [nextId, setNextId] = useState();
    const { userDetailes } = useContext(AppContext)

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
                let commentsArr = []
                for (let i = 0; i < data.length; i++)
                    commentsArr.push({ ...data[i], i: i, editable: false })
                setComments(commentsArr);
            }).catch(ex => alert(ex))
    }, [])

    useEffect(() => {
        if (nextId != null)
            fetch("http://localhost:3000/nextIDs/4", {
                method: "PATCH",
                body: JSON.stringify({
                    "nextId": nextId
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            })
                .then((response) => {
                    if (!response.ok)
                        throw 'Error' + response.status + ': ' + response.statusText;
                    return response.json();
                })
                .then((json) => console.log(json))
                .catch(ex => alert(ex));
    }, [nextId])

    function addingComment(event) {
        event.preventDefault();
        const { name, body } = event.target
        const newComment = { postId: state.post.id, id: `${nextId}`, name: name.value, email: userDetails.email, body: body.value }
        fetch('http://localhost:3000/comments', {
            method: 'POST',
            body: JSON.stringify(newComment),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setUserComments(prev => [...prev, newComment])
            setComments(prev => [...prev, { ...newComment, i: userComments.length, editable: false }])
            setShowAdditionForm(false)
            setNextId(prev => prev + 1)
        }).catch((ex) => alert(ex));
    }

    function deleteComment(Index, i, id) {
        if (confirm('Are you sure you want to delete this comment from the database?')) {
            fetch(`http://localhost:3000/comments/${id}`, {
                method: 'DELETE'
            }).then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
            }).then(() => {
                setUserComments((prev) => [...prev.slice(0, Index), null, ...prev.slice(Index + 1, prev.length)])
                setComments((prev) => [...prev.slice(0, i), ...prev.slice(i + 1, prev.length)])
            }).catch((ex) => alert(ex));
        } else {
            return;
        }
    }

    function changeEditable(i) {
        setComments(prev => [...prev.slice(0, i), { ...prev[i], editable: !prev[i].editable }, ...prev.slice(i + 1, prev.length)])
    }

    function updateComment(event, index, i, id) {
        event.preventDefault()
        const { title, completed } = event.target;
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
            setUserComments(prev => [...prev.slice(0, index), { ...prev[index], title: title.value, completed: completed.value }, ...prev.slice(index + 1, prev.length)])
            setComments(prev => [...prev.slice(0, i), { ...prev[i], title: title.value, completed: completed.value }, ...prev.slice(i + 1, prev.length)])
            changeEditable(i)
        }).catch((ex) => alert(ex));
    }

    return (<>
        <br /><br />
        <button onClick={() => (setShowAdditionForm(prev => !prev))}>Add comment</button>
        <br />

        {showAdditionForm && <form onSubmit={addingComment}>
            <label htmlFor='name' >name</label>
            <input name='name' type='text' required></input>
            <label htmlFor='body' >body</label>
            <input name='body' type='text' required></input>
            <button type="submit">Add</button>
        </form>}
        <br />
        <h2> <ins>comments list</ins></h2>
        {comments.length == 0 ? <h2>There are no comments</h2>
            : comments.map((comment, i) => {
                return (
                    <form key={i} onSubmit={(event) => updateComment(event, comment.i, i, comment.id)}>
                        <span style={{ marginRight: 10 }}>{comment.id}: </span>
                        {comment.editable ? <>
                            <input name="name" type="text" defaultValue={comment.name} style={{ width: 300 }} />
                            <br />
                            <input name="body" type="text" defaultChecked={comment.body} /></>
                            : <><span><b>name: </b> {comment.name} </span>
                                <br />
                                <span><b>body: </b> {comment.body} </span> </>}
                        {userDetailes.email == comment.email && <img src={edit} onClick={() => changeEditable(i)} />}
                        <img onClick={() => deleteComment(comment.i, i, comment.id)} src={trash} />
                        {comment.editable && <button type="submit" >update</button>}
                        <br /><br />
                    </form>)
            })}</>)
}

export default Comments;








