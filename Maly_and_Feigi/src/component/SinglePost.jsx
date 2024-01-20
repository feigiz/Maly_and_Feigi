import React, { useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import edit from "../icons/edit.png"
import { AppContext } from "../App";
function SinglePost({ post, changeEditable, i }) {
    const { userDetailes } = useContext(AppContext)
    const navigate = useNavigate();
    // console.log(post)
    // { post, i, changeEditable }
    // const {post,changeEditable,i} = rou
    // console.log(detailes.post)
    return (<>
        {post.editable ?
            <div>
                title: <input name="title" type="text" defaultValue={post.title} style={{ width: 300 }} />
                <br />
                body: <input name="body" type="text" defaultValue={post.body} style={{ width: 500 }} />
            </div>
            : <div >
                <h3>title: {post.title} </h3>
                {/* <br /> */}
                <p>body: {post.body} </p>
            </div>}
            <button onClick={()=>navigate(`./comments`)}>show comments</button>
        {/* <Link to="./comments" state={{ userDetailes, post }}>show comments</Link> */}
        <img src={edit} onClick={() => changeEditable(i)} />
        {/* <Outlet/> */}
    </>);
}

export default SinglePost;

