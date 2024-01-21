import React, { useContext, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import edit from "../icons/edit.png"
import { AppContext } from "../App";
import trash from "../icons/trash.png"


function SingleAlbum() {
    // return(<>
    //     <Link to="./comments" state={3}>show comments</Link>
    //     <Outlet />
    // </>)
    const { userDetails, albums, setAlbums, setUserAlbums } = useContext(AppContext)
    const navigate = useNavigate();
    const { state } = useLocation();
    const [isEditable, setIsEditable] = useState(false)
    const { i } = state;

    function updateAlbum(event) {
        event.preventDefault()
        const { title, body } = event.target;

        fetch(`http://localhost:3000/albums/${albums[i].id}`, {
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
            setUserAlbums(prev =>
                [...prev.slice(0, albums[i].originalIndex),
                { ...prev[albums[i].originalIndex], title: title.value, body: body.value },
                ...prev.slice(albums[i].originalIndex + 1, prev.length)])
            setAlbums(prev =>
                [...prev.slice(0, i), { ...prev[i], title: title.value, body: body.value },
                ...prev.slice(i + 1, prev.length)])
            setIsEditable(prev => !prev)
            // console.log(albums)
        }).catch((ex) => alert(ex));
    }

    function deleteAlbum() {
        if (confirm('Are you sure you want to delete this album from the database?')) {
            fetch(`http://localhost:3000/albums/${albums[i].id}`, {
                method: 'DELETE'
            }).then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
            }).then(() => {
                setUserAlbums((prev) => [...prev.slice(0, albums[i].originalIndex), null, ...prev.slice(albums[i].originalIndex + 1, prev.length)])
                setAlbums((prev) => [...prev.slice(0, i), ...prev.slice(i + 1, prev.length)])
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
        > <span>back to all albums</span></Link>
        <h3>id: {albums[i].id}</h3>
        {isEditable ?
            <form onSubmit={updateAlbum}>
                title: <input name="title" type="text" defaultValue={albums[i].title} style={{ width: 300 }} />
                <br />
                body: <input name="body" type="text" defaultValue={albums[i].body} style={{ width: 500 }} />
                <button type="submit" >update</button>
            </form>
            : <div >
                <h3>title: {albums[i].title} </h3>
                <p>body: {albums[i].body} </p>
            </div>}

        {/* <Link to="./comments" state={i}>show comments</Link>
        <Outlet /> */}
         <img src={edit} onClick={() => setIsEditable(prev => !prev)} />
        <img onClick={() => deleteAlbum()} src={trash} />
        <button onClick={() => navigate('./comments', { state: { i } })}>show comments</button>
        <Outlet />
       
    </>);
}

export default SingleAlbum;

