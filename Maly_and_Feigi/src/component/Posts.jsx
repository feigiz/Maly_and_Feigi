import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import trash from "../icons/trash.png"
import { AppContext } from "../App";
import useNextId from "./useNextId";

function Posts() {
    const navigate = useNavigate();
    const [showAdditionForm, setShowAdditionForm] = useState(false);
    const [nextId, setNextId] = useNextId(3);
    const [searchType, setSearchType] = useState()
    const [posts, setPosts] = useState([])
    const [originalPosts, setOriginalPosts] = useState([])
    const { userDetails } = useContext(AppContext)

    useEffect(() => {
        fetch(`http://localhost:3000/posts?userId=${userDetails.id}`)
            .then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();
            })
            .then(data => {
                setOriginalPosts(data);
                let postsArr = []
                for (let i = 0; i < data.length; i++)
                    postsArr.push({ ...data[i], originalIndex: i })
                setPosts(postsArr);
            }).catch(ex => alert(ex))
    }, [])

    function addPost(event) {
        event.preventDefault();
        const { title, body } = event.target;
        const newPost = { userId: userDetails.id, id: `${nextId}`, title: title.value, body: body.value }
        fetch('http://localhost:3000/posts', {
            method: 'POST',
            body: JSON.stringify(newPost),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setOriginalPosts(prev => [...prev, newPost])
            setPosts(prev => [...prev, { ...newPost, originalIndex: originalPosts.length }])
            setShowAdditionForm(false)
            setNextId(prev => prev + 1)
        }).catch((ex) => alert(ex));
    }

    function deletePost(originalIndex, i, id) {
        if (confirm('Are you sure you want to delete this post from the database?')) {
            fetch(`http://localhost:3000/posts/${id}`, {
                method: 'DELETE'
            }).then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
            }).then(() => {
                setOriginalPosts((prev) => [...prev.slice(0, originalIndex), null, ...prev.slice(originalIndex + 1, prev.length)])
                setPosts((prev) => [...prev.slice(0, i), ...prev.slice(i + 1, prev.length)])
            }).catch((ex) => alert(ex));
        } else {
            return;
        }
    }

    function searchPosts(event) {
        let foundsArr, foundIndex;
        const { name, value } = event.target;
        switch (name) {
            case "id":
                foundIndex = originalPosts.findIndex(p => p != null && p.id == value)
                setPosts([{ ...originalPosts[foundIndex], originalIndex: foundIndex }])
                break;
            case "title":
                foundsArr = originalPosts.map((p, i) => { if (p != null && p.title.includes(value)) return { ...p, originalIndex: i, } })
                setPosts(foundsArr.filter(p => p != null))
                break;
        }
    }

    function selectSearchType(event) {
        let foundsArr;
        if (event.target.value == "all") {
            foundsArr = originalPosts.map((p, i) => { if (p != null) return { ...p, originalIndex: i } })
            setPosts(foundsArr.filter(p => p != null));
            setSearchType();
        }
        else
            setSearchType(event.target.value);
    }

    return (<>
        <button onClick={() => (setShowAdditionForm(prev => !prev))}>Add post</button>
        <br />
        {showAdditionForm && <form onSubmit={addPost}>
            <label htmlFor='title' >post title</label>
            <input name='title' type='text' required></input>
            <label htmlFor='body' >post body</label>
            <input name='body' type='text' required></input>
            <button type="submit">Add</button>
        </form>}

        <label htmlFor='search' >Search by</label>
        <select onChange={selectSearchType} name="search">
            <option value="all"></option>
            <option value="id">id</option>
            <option value="title">title</option>
        </select>
        <br />
        {searchType ? <input type="text" name={searchType} onChange={event => searchPosts(event)} /> : <></>}

        <h1><ins>Posts list</ins></h1><div className="postsContainer" >
            {posts.length == 0 ? <h2>No posts found</h2>
                : posts.map((post, i) => {
                    return (post.id > -1 ?
                        <div className="post" key={i}>
                            <span>{post.id}: </span>
                            <span onClick={() => navigate(`./${post.id}`, { state: { post } })}>{post.title} </span>
                            <img onClick={() => deletePost(post.originalIndex, i, post.id)} src={trash} />
                        </div>
                        : <h2>No posts found</h2>)
                })}
        </div>
    </>);
}

export default Posts;