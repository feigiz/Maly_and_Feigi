import React, { useEffect, useState,useContext } from "react";
import { useLocation, NavLink, Outlet, useNavigate } from 'react-router-dom';
import trash from "../icons/trash.png"
import edit from "../icons/edit.png"
import arrowDown from "../icons/angle-small-down.png"
// import arrowUp from "../icons/angle-small-up.png"
import SinglePost from "./SinglePost";
import { AppContext } from "../App";


function Posts() {
    const navigate = useNavigate();
    const [userPosts, setUserPosts] = useState([]);
    const [showAdditionForm, setShowAdditionForm] = useState(false);
    // const [editables, setEditables] = useState([]);
    const [posts, setPosts] = useState([]);
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

        //fech posts
        fetch(`http://localhost:3000/posts?userId=${userDetailes.id}`)
            .then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();
            })
            .then(data => {
                setUserPosts(data);
                // setUserPosts(data.map(post => { return { ...post, editables: false } }));
                let postsArr = []
                for (let i = 0; i < data.length; i++)
                    postsArr.push({ ...data[i], i: i, editable: false, postDetailsView: false })
                setPosts(postsArr);
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

    function addingPost(event) {
        event.preventDefault();
        const newPost = { userId: userDetailes.state.id, id: `${nextId}`, title: event.target[0].value, completed: false }
        fetch('http://localhost:3000/posts', {
            method: 'POST',
            body: JSON.stringify(newPost),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setUserPosts(prev => [...prev, newPost])
            setPosts(prev => [...prev, { ...newPost, i: userPosts.length, editable: false, postDetailsView: false }])
            setShowAdditionForm(false)
            setNextId(prev => prev + 1)
        }).catch((ex) => alert(ex));
    }

    function deletePost(userIndex, i, id) {
        if (confirm('Are you sure you want to delete this post from the database?')) {
            fetch(`http://localhost:3000/posts/${id}`, {
                method: 'DELETE'
            }).then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
            }).then(() => {
                setUserPosts((prev) => [...prev.slice(0, userIndex), null, ...prev.slice(userIndex + 1, prev.length)])
                setPosts((prev) => [...prev.slice(0, i), ...prev.slice(i + 1, prev.length)])
            }).catch((ex) => alert(ex));
        } else {
            return;
        }
    }

    function changeEditable(i) {
        setPosts(prev => [...prev.slice(0, i), { ...prev[i], editable: !prev[i].editable }, ...prev.slice(i + 1, prev.length)])
    }

    function changePostDetailsView(i, post) {
        setPosts(prev => [...prev.slice(0, i), { ...prev[i], postDetailsView: !prev[i].postDetailsView }, ...prev.slice(i + 1, prev.length)])
        // navigate(`./${post.id}`, {post:post,changeEditable:changeEditable,i:i})
    }

    function sortPosts(event) {
        event.preventDefault()
        let sortArr = posts.slice()
        switch (event.target.value) {
            case "id":
                setPosts(sortArr.sort((a, b) => a.id - b.id))
                break;
            case "alphabet":
                setPosts(sortArr.sort((a, b) => a.title > b.title ? 1 : -1))
                break;
            case "completed":
                setPosts(sortArr.sort(a => a.completed ? -1 : 1))
                break;
            case "random":
                setPosts(sortArr.sort(() => Math.random() > 0.5 ? -1 : 1))
                break;
        }
        console.log(userPosts)
    }

    function updatePost(event, userIndex, i, id) {
        event.preventDefault()
        const { title, completed } = event.target;
        console.log(completed.checked)


        fetch(`http://localhost:3000/posts/${id}`, {
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
            setUserPosts(prev => [...prev.slice(0, userIndex), { ...prev[userIndex], title: title.value, completed: completed.value }, ...prev.slice(userIndex + 1, prev.length)])
            setPosts(prev => [...prev.slice(0, i), { ...prev[i], title: title.value, completed: completed.value }, ...prev.slice(i + 1, prev.length)])
            changeEditable(i)
        }).catch((ex) => alert(ex));
    }

    function searchPosts(event) {
        let foundsArr;
        let foundIndex;
        console.log(event.target.value)
        switch (event.target.name) {
            case "id":
                foundIndex = userPosts.findIndex(t => t != null && t.id == event.target.value)
                setPosts([{ ...userPosts[foundIndex], i: foundIndex, editable: false, postDetailsView: false }])
                break;
            case "title":
                foundsArr = userPosts.map((t, i) => { if (t != null && t.title.includes(event.target.value)) return { ...t, i: i, editable: false, postDetailsView: false } })
                setPosts(foundsArr.filter(t => t != null))
                break;
            case "searchBycompleted":
                foundsArr = userPosts.slice()
                    .map((t, i) => { if (t != null && t.completed) return { ...t, i: i, editable: false, postDetailsView: false } })
                setPosts(foundsArr.filter(t => t != null))
                break;
            case "notComplete":
                foundsArr = userPosts.map((t, i) => { if (t != null && !t.completed) return { ...t, i: i, editable: false, postDetailsView: false } })
                setPosts(foundsArr.filter(t => t != null))
                break;
        }
    }

    function search(event) {
        let foundsArr;
        if (event.target.value == "all") {
            foundsArr = userPosts.map((t, i) => { if (t != null) return { ...t, i: i, editable: false, postDetailsView: false } })
            setPosts(foundsArr.filter(t => t != null));
            setSearchType();
        }
        else
            setSearchType(event.target.value);
        console.log(event.target.value)
    }

    return (<>
        <br /><br />
        <button onClick={() => (setShowAdditionForm(prev => !prev))}>Add post</button>
        {/* <button onClick={submitChanges}>Submit changes</button> */}
        <br />

        {showAdditionForm && <form onSubmit={addingPost}>
            <label htmlFor='title' >post title</label>
            <input name='title' type='text' required></input>
            <button type="submit">Add</button>
        </form>}

        <br />
        <label htmlFor='sort' >order by</label>
        <select onChange={sortPosts} name="sort">
            <option value="all" > </option>
            <option value="id">id</option>
            <option value="alphabet">alphabet</option>
            <option value="completed">completed</option>
            <option value="random">random</option>
        </select>

        <label htmlFor='search' >search by</label>
        <select onChange={search} name="search">
            <option value="all" onClick={searchPosts}></option>
            <option value="id">id</option>
            <option value="title">title</option>
            <option value="completed">completed</option>
        </select>
        <br />
        {searchType ? (searchType == "completed" ?
            <>
                <label htmlFor="completed">completed</label>
                <input type="radio" name="searchBycompleted" value="true" onChange={event => searchPosts(event)} />
                <label htmlFor="notCompleted">not completed</label>
                <input type="radio" name="searchBycompleted" value="false" onChange={event => searchPosts(event)} />
            </> : <input type="text" name={searchType} onChange={event => searchPosts(event)} />)
            : <></>}
        <h2><ins>posts list</ins></h2>
        {posts.length == 0 ? <h2>There are no posts</h2>
            : posts.map((post, i) => {
                return (
                    <form  style={post.postDetailsView ? { backgroundColor: "rgb(180, 229, 201)", borderRadius: 10, padding: 20 } : {}} key={i} onSubmit={(event) => updatePost(event, post.i, i, post.id)}>
                        {!post.postDetailsView && <span style={{ marginRight: 10 }}>{post.id}: </span>}
                        {!post.postDetailsView && <span>{post.title} </span>}
                        {/* {post.postDetailsView && <Outlet />} */}
                        {post.postDetailsView && <SinglePost post={post} i={i} changeEditable={changeEditable} />}
                        <img onClick={() => deletePost(post.i, i, post.id)} src={trash} />
                        <img src={arrowDown} onClick={() => changePostDetailsView(i, post)} />
                        {/* {!post.postDetailsView && <img src={arrowDown} onClick={() => changePostDetailsView(i)} />} */}
                        {/* {post.postDetailsView && <img src={arrowUp} onClick={() => changePostDetailsView(i)} />} */}
                        <br /><br />
                        {post.editable && <button type="submit" >update</button>}
                    </form>

                )
            })}
    </>);
}
// post.postDetailsView ?
export default Posts;


// {post.editable ?
//     <input name="title" type="text" defaultValue={post.title} style={{ width: 300 }} />
//     : <span>{post.title} </span>}
// {/* <input name="completed" type="checkbox" defaultChecked={post.completed} /></> */}
// {/* <input name="completed" type="checkbox" disabled={true} checked={post.completed} /></> */}
// <img src={edit} onClick={() => changeEditable(i)} />
// <img onClick={() => deletePost(post.i, i, post.id)} src={trash} />
// <img src={arrow} onClick={() => changePostDetailsView(i)} />

// {post.editable && <button type="submit" >update</button>}