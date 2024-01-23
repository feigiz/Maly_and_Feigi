import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import trash from "../icons/trash.png"
import { AppContext } from "../App";
import useNextId from "./useNextId";


function PostsOfAllUsers() {
    const navigate = useNavigate();
    const [showAdditionForm, setShowAdditionForm] = useState(false);
    const [nextId, setNextId] = useNextId(3);
    const [searchType, setSearchType] = useState();
    const { userDetails, posts, setPosts, originalPosts, setOriginalPosts } = useContext(AppContext)

    useEffect(() => {
        fetch("http://localhost:3000/posts")
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
        <br /><br />

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
                            <span onClick={() => navigate(`./${post.id}`, { state: { i } })}>{post.title} </span>
                        </div>
                        : <h2>No posts found</h2>)
                })}
        </div>
    </>);
}

export default PostsOfAllUsers;