import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import trash from "../icons/trash.png"
import edit from "../icons/edit.png"
import { AppContext } from "../App";
import useNextId from "./useNextId";


function Comments() {
    const { state } = useLocation();
    const [showAdditionForm, setShowAdditionForm] = useState(false);
    const [comments, setComments] = useState([]);
    const [nextId, setNextId] = useNextId(4);
    const { userDetails } = useContext(AppContext)
    const navigate = useNavigate();
    const { post } = state;

    useEffect(() => {
        fetch(`http://localhost:3000/comments?postId=${post.id}`)
            .then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();
            })
            .then(data => {
                let commentsArr = []
                for (let i = 0; i < data.length; i++)
                    commentsArr.push({ ...data[i], editable: false })
                setComments(commentsArr);
            }).catch(ex => alert(ex))
    }, [])

    function addComment(event) {
        event.preventDefault();
        const { name, body } = event.target
        const newComment = { postId: post.id, id: `${nextId}`, name: name.value, email: userDetails.email, body: body.value }
        fetch('http://localhost:3000/comments', {
            method: 'POST',
            body: JSON.stringify(newComment),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setComments(prev => [...prev, { ...newComment, editable: false }])
            setShowAdditionForm(false)
            setNextId(prev => prev + 1)
        }).catch((ex) => alert(ex));
    }

    function deleteComment(i, id) {
        if (confirm('Are you sure you want to delete this comment from the database?')) {
            fetch(`http://localhost:3000/comments/${id}`, {
                method: 'DELETE'
            }).then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
            }).then(() => {
                setComments((prev) => [...prev.slice(0, i), ...prev.slice(i + 1, prev.length)])
            }).catch((ex) => alert(ex));
        } else {
            return;
        }
    }

    function updateComment(event, i, id) {
        event.preventDefault()
        const updatedComment = { name: event.target.name.value, body: event.target.body.value }
        fetch(`http://localhost:3000/comments/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedComment),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setComments(prev => [...prev.slice(0, i), { ...prev[i], ...updatedComment }, ...prev.slice(i + 1, prev.length)])
            changeEditable(i)
        }).catch((ex) => alert(ex));
    }

    function changeEditable(i) {
        setComments(prev => [...prev.slice(0, i), { ...prev[i], editable: !prev[i].editable }, ...prev.slice(i + 1, prev.length)])
    }

    return (<>
        <button onClick={() => navigate("..", { state: { post } })}>Close</button>
        <br /><br />
        <button onClick={() => (setShowAdditionForm(prev => !prev))}>Add comment</button>
        <br />
        {showAdditionForm && <form onSubmit={addComment}>
            <label htmlFor='name' >name</label>
            <input name='name' type='text' required></input>
            <br />
            <label htmlFor='body' >body</label>
            <input name='body' className="bodyInput" type='text' required></input>
            <button type="submit">Add</button>
        </form>}
        <br />

        <h2><ins>Comments list</ins></h2>
        {comments.length == 0 ? <h2>No comments found</h2>
            : comments.map((comment, i) => {
                return (
                    <form key={i} onSubmit={(event) => updateComment(event, i, comment.id)}>
                        <span>{comment.id}: </span>
                        {comment.editable ? <>
                            name: <input name="name" type="text" defaultValue={comment.name} className="nameInput" />
                            <br />
                            body: <input name="body" type="text" defaultValue={comment.body} className="bodyInput" /></>
                            : <><span><b>name: </b> {comment.name} </span>
                                <br />
                                <span><b>body: </b> {comment.body} </span> </>}
                        {userDetails.email == comment.email && <>
                            <img src={edit} onClick={() => changeEditable(i)} />
                            <img onClick={() => deleteComment(i, comment.id)} src={trash} />
                        </>}
                        {comment.editable && <button type="submit" >Update</button>}
                        <br /><br />
                    </form>)
            })}
    </>)
}

export default Comments;