import React, { useEffect, useState, useContext, createContext } from "react";
import { useLocation, NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import trash from "../icons/trash.png"
// import edit from "../icons/edit.png"
import arrowDown from "../icons/angle-small-down.png"
import arrowUp from "../icons/angle-small-up.png"
import SinglePost from "./SinglePost";
import { AppContext } from "../App";



function Posts() {
    const navigate = useNavigate();
    // const [userPosts, setUserPosts] = useState([]);
    const [showAdditionForm, setShowAdditionForm] = useState(false);
    // const [editables, setEditables] = useState([]);
    // const {  } = useContext(PostContext);
    // const [stringSearch, setStringSearch] = useState();
    const [nextId, setNextId] = useState();
    const [searchType, setSearchType] = useState();
    const { userDetails, posts, setPosts, userPosts, setUserPosts } = useContext(AppContext)

    useEffect(() => {
        //fech next id
        fetch("http://localhost:3000/nextIDs/3")
            .then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();
            })
            .then((json) => {
                setNextId(json.nextId)
            }).catch(ex => alert(ex))

        //fech posts
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
                    postsArr.push({ ...data[i], originalIndex: i, editable: false, postDetailsView: false })
                setPosts(postsArr);
            }).catch(ex => alert(ex))
    }, [])

    useEffect(() => {
        if (nextId != null)
            fetch("http://localhost:3000/nextIDs/3", {
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
            setPosts(prev => [...prev, { ...newPost, originalIndex: userPosts.length, editable: false, postDetailsView: false }])
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

    function changeEditable(i) {
        setPosts(prev => [...prev.slice(0, i), { ...prev[i], editable: !prev[i].editable }, ...prev.slice(i + 1, prev.length)])
    }

    function changePostDetailsView(i, post) {
        setPosts(prev => [...prev.slice(0, i), { ...prev[i], postDetailsView: !prev[i].postDetailsView }, ...prev.slice(i + 1, prev.length)])
        // navigate(`./${post.id}`, {post:post,changeEditable:changeEditable,originalIndex:i})
        navigate(`./${post.id}`)
    }

    function updatePost(event, originalIndex, i, id) {
        event.preventDefault()
        const { title, body } = event.target;

        fetch(`http://localhost:3000/posts/${id}`, {
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
            setUserPosts(prev => [...prev.slice(0, originalIndex), { ...prev[originalIndex], title: title.value, body: body.value }, ...prev.slice(originalIndex + 1, prev.length)])
            setPosts(prev => [...prev.slice(0, i), { ...prev[i], title: title.value, body: body.value }, ...prev.slice(i + 1, prev.length)])
            changeEditable(i)
        }).catch((ex) => alert(ex));
    }

    function searchPosts(event) {
        let foundsArr;
        let foundIndex;
        switch (event.target.name) {
            case "id":
                foundIndex = userPosts.findIndex(p => p != null && p.id == event.target.value)
                setPosts([{ ...userPosts[foundIndex], originalIndex: foundIndex, editable: false, postDetailsView: false }])
                break;
            case "title":
                foundsArr = userPosts.map((p, i) => { if (p != null && p.title.includes(event.target.value)) return { ...p, originalIndex: i, editable: false, postDetailsView: false } })
                setPosts(foundsArr.filter(p => p != null))
                break;
        }
    }

    function search(event) {
        let foundsArr;
        if (event.target.value == "all") {
            foundsArr = userPosts.map((p, i) => { if (p != null) return { ...p, originalIndex: i, editable: false, postDetailsView: false } })
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

        <h2><ins>posts list</ins></h2>
        {posts.length == 0 ? <h2>No posts found</h2>
            : posts.map((post, i) => {
                return (post.id > -1 ?
                    <div key={i}>
                        <form onClick={() => navigate(`./${post.id}`, { state: { i } })}
                            style={post.postDetailsView ? { backgroundColor: "rgb(180, 229, 201)", borderRadius: 10, padding: 20, margin: 20 } : {}}
                            key={i} >
                            <span style={{ marginRight: 10 }}>{post.id}: </span>
                            <span>{post.title} </span>

                            {/* {post.postDetailsView && <SinglePost post={post} i={i} changeEditable={changeEditable} />} */}
                            {/* <Link to={`./${post.id}`} state={{post,changeEditable,i}}><img src={arrowDown} /></Link> */}
                            {/* <Link to={`./${post.id}`} state={{ post, i }}><img src={arrowDown} /></Link> */}
                            {/* <img src={arrowDown} onClick={()=>navigate(`./${post.id}` ,{state:{ post, i }})} /> */}
                            {/* <Outlet />                         */}
                            <br /><br />
                        </form> <img onClick={() => deletePost(post.originalIndex, i, post.id)} src={trash} />
                    </div>
                    : <h2>No posts found</h2>
                )
            })}
    </>);
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