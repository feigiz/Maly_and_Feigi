import React, { useContext, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from "../App";
import Photos from "./Photos";


function SingleAlbum() {
    const { userDetails, albums, setAlbums,  setOriginalAlbums } = useContext(AppContext)
    const { state } = useLocation();
    const  {i}  = state;

    useEffect(() => {
        if (albums.length == 0)
            fetch(`http://localhost:3000/albums?userId=${userDetails.id}`)
                .then(response => {
                    if (!response.ok)
                        throw 'Error' + response.status + ': ' + response.statusText;
                    return response.json();
                })
                .then(data => {
                    setOriginalAlbums(data);
                    let albumsArr = []
                    for (let i = 0; i < data.length; i++)
                        albumsArr.push({ ...data[i], originalIndex: i })
                    setAlbums(albumsArr);
                }).catch(ex => alert(ex))
    }, [])

    return (albums.length && <>
        <br /><br /><Link
            to="../.."
            relative="path"
        > <span>Back to all albums</span></Link>
        <h3>id: {albums[i].id}</h3>
        <h3>title: {albums[i].title} </h3>
        <Photos />
    </>);
}

export default SingleAlbum;

