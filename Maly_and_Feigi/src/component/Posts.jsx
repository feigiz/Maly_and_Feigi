import React, { useEffect, useState } from "react";
import { useLocation, NavLink, Outlet, useNavigate } from 'react-router-dom';



function Posts() {
    const userDetailes = useLocation();
    const [userPosts, SetUserPosts] = useState([]);
    const [posts, setPosts] = useState(null)

    useEffect(() => {
        try {
            fetch(`http://localhost:3000/posts?userId=${userDetailes.state.id}`)
                .then(response => {
                    if (!response.ok)
                        throw 'Error' + response.status + ': ' + response.statusText;
                    return response.json();
                })
                .then(data => {
                    SetUserPosts(data);
                    let postsArr = []
                    for (let i = 0; i < data.length; i++)
                        postsArr.push({ ...data[i], i: i, editable: false })
                    setposts(postsArr);
                })
        } catch (ex) { alert(ex); }

    }, [])


    return (<>

    </>);
}

export default Posts;