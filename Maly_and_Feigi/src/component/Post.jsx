import React, { useEffect, useState, useContext } from "react";
import { useLocation, NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import trash from "../icons/trash.png"
// import edit from "../icons/edit.png"
import arrowDown from "../icons/angle-small-down.png"
import arrowUp from "../icons/angle-small-up.png"
import SinglePost from "./SinglePost";
import { AppContext } from "../App";

function Post({post,i}){
    return (post.id > -1 ?
        <form
            style={post.postDetailsView ? { backgroundColor: "rgb(180, 229, 201)", borderRadius: 10, padding: 20, margin: 20 } : {}}
            key={i} onSubmit={(event) => updatePost(event, post.originalIndex, i, post.id)}>

            <span style={{ marginRight: 10 }}>{post.id}: </span>
            <span>{post.title} </span>

            {/* {post.postDetailsView && <SinglePost post={post} i={i} changeEditable={changeEditable} />} */}
            <img onClick={() => deletePost(post.originalIndex, i, post.id)} src={trash} />
            {/* <Link to={`./${post.id}`} state={{post,changeEditable,i}}><img src={arrowDown} /></Link> */}
            <Link to={`./${post.id}`} state={{post}}><img src={arrowDown} /></Link>
            <Outlet />                        
            <br /><br />
            {post.editable && post.postDetailsView && <button type="submit" >update</button>}
        </form> : <h2>No posts found</h2>
    )
}

export default Post;