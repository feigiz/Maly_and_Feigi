import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import trash from "../icons/trash.png"
import { AppContext } from "../App";
import { useForm } from "react-hook-form";
import useNextId from "./useNextId";

function Posts() {
    const navigate = useNavigate();
    // const [userPosts, setUserPosts] = useState([]);
    const [showAdditionForm, setShowAdditionForm] = useState(false);
    // const [editables, setEditables] = useState([]);
    // const {  } = useContext(PostContext);
    // const [stringSearch, setStringSearch] = useState();
    const [nextId, setNextId] = useNextId(3);
    const [searchType, setSearchType] = useState();
    const { userDetails, posts, setPosts, userPosts, setUserPosts } = useContext(AppContext)
    const { register, handleSubmit, } = useForm()
    useEffect(() => {
        fetch(`http://localhost:3000/posts?userId=${userDetails.id}`)
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
                    postsArr.push({ ...data[i], originalIndex: i })
                setPosts(postsArr);
            }).catch(ex => alert(ex))
    }, [])

    function addingPost(event) {
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
            setUserPosts(prev => [...prev, newPost])
            setPosts(prev => [...prev, { ...newPost, originalIndex: userPosts.length }])
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
                setUserPosts((prev) => [...prev.slice(0, originalIndex), null, ...prev.slice(originalIndex + 1, prev.length)])
                setPosts((prev) => [...prev.slice(0, i), ...prev.slice(i + 1, prev.length)])
            }).catch((ex) => alert(ex));
        } else {
            return;
        }
    }

    function searchPosts(event) {
        let foundsArr;
        let foundIndex;
        switch (event.target.name) {
            case "id":
                foundIndex = userPosts.findIndex(p => p != null && p.id == event.target.value)
                setPosts([{ ...userPosts[foundIndex], originalIndex: foundIndex }])
                break;
            case "title":
                foundsArr = userPosts.map((p, i) => { if (p != null && p.title.includes(event.target.value)) return { ...p, originalIndex: i, } })
                setPosts(foundsArr.filter(p => p != null))
                break;
        }
    }

    function search(event) {
        let foundsArr;
        if (event.target.value == "all") {
            foundsArr = userPosts.map((p, i) => { if (p != null) return { ...p, originalIndex: i } })
            setPosts(foundsArr.filter(p => p != null));
            setSearchType();
        }
        else
            setSearchType(event.target.value);
    }

    return (<>
        <br /><br />
        <button onClick={() => (setShowAdditionForm(prev => !prev))}>Add post</button>
        <br />

        {showAdditionForm && <form onSubmit={addingPost}>
            <label htmlFor='title' >post title</label>
            <input name='title' type='text' required></input>
            <label htmlFor='body' >post body</label>
            <input name='body' type='text' required></input>
            <button type="submit">Add</button>
        </form>}

        <label htmlFor='search' >search by</label>
        <select onChange={search} name="search">
            <option value="all"></option>
            <option value="id">id</option>
            <option value="title">title</option>
        </select>
        <br />

        {searchType ? <input type="text" name={searchType} onChange={event => searchPosts(event)} /> : <></>}

        <h2><ins>posts list</ins></h2><div className="postsContainer" >
        {posts.length == 0 ? <h2>No posts found</h2>
            : posts.map((post, i) => {
                return (post.id > -1 ?
                    <div className="post" key={i}>
                        {/* <div key={i} > */}
                        <span>{post.id}: </span>
                        <span onClick={() => navigate(`./${post.id}`, { state: { i } })}>{post.title} </span>
                        {/* <br /><br /> */}
                        {/* </div> */}
                        <img onClick={() => deletePost(post.originalIndex, i, post.id)} src={trash} />
                    </div>
                    : <h2>No posts found</h2>
                )
            })}
    </div></>);
}

export default Posts;
// post.postDetailsView ?


// {post.editable ?
//     <input name="title" type="text" defaultValue={post.title} style={{ width: 300 }} />
//     : <span>{post.title} </span>}
// {/* <input name="completed" type="checkbox" defaultChecked={post.completed} /></> */}
// {/* <input name="completed" type="checkbox" disabled={true} checked={post.completed} /></> */}
// <img src={edit} onClick={() => changeEditable(i)} />
// <img onClick={() => deletePost(post.i, i, post.id)} src={trash} />
// <img src={arrow} onClick={() => changePostDetailsView(i)} />

// {post.editable && <button type="submit" >update</button>}




// {/* <form
// style={post.postDetailsView ? { backgroundColor: "rgb(180, 229, 201)", borderRadius: 10, padding: 20, margin: 20 } : {}}
// key={i} onSubmit={(event) => updatePost(event, post.originalIndex, i, post.id)}>

// {!post.postDetailsView && <span style={{ marginRight: 10 }}>{post.id}: </span>}
// {!post.postDetailsView && <span>{post.title} </span>}
// {post.postDetailsView && <Outlet />}
// {/* {post.postDetailsView && <SinglePost post={post} i={i} changeEditable={changeEditable} />} */}
// <img onClick={() => deletePost(post.originalIndex, i, post.id)} src={trash} />
// {!post.postDetailsView && <img src={arrowDown} onClick={() => changePostDetailsView(i, post)} />}
// {post.postDetailsView && <img src={arrowUp} onClick={() => changePostDetailsView(i, post)} />}
// <br /><br />
// {post.editable && post.postDetailsView && <button type="submit" >update</button>}
// </form> : <h2>No posts found</h2> */}