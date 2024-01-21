import React, { useContext, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from "../App";
import Photos from "./Photos";


function SingleAlbum() {
    const { userDetails, albums, setAlbums, setUserAlbums } = useContext(AppContext)
    const { state } = useLocation();
    const { i } = state;

    return (<>
        <Link
            to=".."
            relative="path"
        > <span>back to all albums</span></Link>
        <h3>id: {albums[i].id}</h3>
        <h3>title: {albums[i].title} </h3>
        <Photos />
    </>);
}

export default SingleAlbum;

