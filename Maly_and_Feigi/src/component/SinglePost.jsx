import React, { useContext, useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import edit from "../icons/edit.png"
import { AppContext } from "../App";
import trash from "../icons/trash.png"
import { useForm } from "react-hook-form";

function SinglePost() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const [post, setPost] = useState(state.post);
    const [isEditable, setIsEditable] = useState(false)
    const { register, handleSubmit } = useForm()

    function updatePost(data) {
        const updatedPost = { title: data.title, body: data.body }
        fetch(`http://localhost:3000/posts/${post.id}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedPost),
            headers: { 'Content-type': 'application/json; charset=UTF-8', },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setPost(prev => { return { ...prev, ...updatedPost } })
            setIsEditable(prev => !prev)
        }).catch((ex) => alert(ex));
    }

    function deletePost() {
        if (confirm('Are you sure you want to delete this post from the database?')) {
            fetch(`http://localhost:3000/posts/${post.id}`, {
                method: 'DELETE'
            }).then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
            }).then(() => {
                navigate("..")
            }).catch((ex) => alert(ex));
        } else
            return;
    }

    return (<div className="singlePostContainer">
        <Link to=".." relative="path"> <span>Back to all posts</span></Link>
        <h3>id: {post.id}</h3>
        {isEditable ?
            <form onSubmit={handleSubmit(updatePost)}>
                title: <input name="title" type="text" defaultValue={post.title} className="nameInput" {...register('title')} />
                <br />
                <b>body: </b> <input name="body" type="text" defaultValue={post.body} className="bodyInput" {...register('body')} />
                <button type="submit" >Update</button>
            </form>
            : <div >
                <h3>title: {post.title} </h3>
                <p>body: {post.body} </p>
            </div>}
        <img src={edit} onClick={() => setIsEditable(prev => !prev)} />
        <img onClick={() => deletePost()} src={trash} />
        <br /><br />
        <button onClick={() => navigate('./comments', { state: { post } })}>Show comments</button>
        <Outlet />
    </div>);
}

export default SinglePost;

