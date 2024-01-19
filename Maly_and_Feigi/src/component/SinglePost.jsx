import React from "react";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import edit from "../icons/edit.png"
function SinglePost({ post, i, changeEditable }) {
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
        <button> show comments</button>
        <img src={edit} onClick={() => changeEditable(i)} />
    </>);
}

export default SinglePost;

