import React, { useContext, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import edit from "../icons/edit.png"
import { AppContext } from "../App";
import trash from "../icons/trash.png"


function SinglePost() {
    const { userDetails, posts, setPosts, setUserPosts } = useContext(AppContext)
    const navigate = useNavigate();
    const { state } = useLocation();
    const [isEditable, setIsEditable] = useState(false)
    const { i } = state;

    function updatePost(event) {
        event.preventDefault()
        const { title, body } = event.target;

        fetch(`http://localhost:3000/posts/${posts[i].id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                title: title.value,
                body: body.value
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setUserPosts(prev =>
                [...prev.slice(0, posts[i].originalIndex),
                { ...prev[posts[i].originalIndex], title: title.value, body: body.value },
                ...prev.slice(posts[i].originalIndex + 1, prev.length)])
            setPosts(prev =>
                [...prev.slice(0, i), { ...prev[i], title: title.value, body: body.value },
                ...prev.slice(i + 1, prev.length)])
            setIsEditable(prev => !prev)
            // console.log(posts)
        }).catch((ex) => alert(ex));
    }

    function deletePost() {
        if (confirm('Are you sure you want to delete this post from the database?')) {
            fetch(`http://localhost:3000/posts/${posts[i].id}`, {
                method: 'DELETE'
            }).then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
            }).then(() => {
                setUserPosts((prev) => [...prev.slice(0, posts[i].originalIndex), null, ...prev.slice(posts[i].originalIndex + 1, prev.length)])
                setPosts((prev) => [...prev.slice(0, i), ...prev.slice(i + 1, prev.length)])
                navigate("..")
            }).catch((ex) => alert(ex));
        } else {
            return;
        }
    }

    return (<>
        <Link
            to=".."
            relative="path"
        > <span>back to all posts</span></Link>
        <h3>id: {posts[i].id}</h3>
        {isEditable ?
            <form onSubmit={updatePost}>
                title: <input name="title" type="text" defaultValue={posts[i].title} style={{ width: 300 }} />
                <br />
                body: <input name="body" type="text" defaultValue={posts[i].body} style={{ width: 500 }} />
                <button type="submit" >update</button>
            </form>
            : <div >
                <h3>title: {posts[i].title} </h3>
                <p>body: {posts[i].body} </p>
            </div>}

        {/* <Link to="./comments" state={i}>show comments</Link>
        <Outlet /> */}
         <img src={edit} onClick={() => setIsEditable(prev => !prev)} />
        <img onClick={() => deletePost()} src={trash} />
        <button onClick={() => navigate('./comments', { state: { i } })}>show comments</button>
        <Outlet />
       
    </>);
}

export default SinglePost;

