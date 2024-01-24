import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from 'react-router-dom';
import trash from "../icons/trash.png"
import edit from "../icons/edit.png"
import useNextId from "./useNextId";

function Photos() {
    const { state } = useLocation();
    const [showAdditionForm, setShowAdditionForm] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [nextId, setNextId] = useNextId(6);
    const { album } = state;

    useEffect(() => {
        fetch(`http://localhost:3000/photos?albumId=${album.id}&_limit=8`)
            .then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();
            })
            .then(data => {
                let photosArr = []
                for (let i = 0; i < data.length; i++)
                    photosArr.push({ ...data[i], editable: false })
                setPhotos(photosArr);
            }).catch(ex => alert(ex))
    }, [])

    function onScroll() {
        const wrappedElement = document.getElementById('header');
        if (wrappedElement.getBoundingClientRect().bottom < window.innerHeight - 130) {
            document.removeEventListener('scroll', onScroll);
            addPhotosToScreen()
        }
    };

    useEffect(() => {
        document.addEventListener('scroll', onScroll);
    }, [photos])

    function addPhotosToScreen() {
        const length = photos.length
        fetch(`http://localhost:3000/photos?albumId=${album.id}&_start=${length}&_end=${length + 8}`)
            .then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();
            })
            .then(data => {
                let photosArr = photos.slice()
                for (let i = 0; i < data.length; i++)
                    photosArr.push({ ...data[i], editable: false })
                setPhotos(photosArr);
            }).catch(ex => alert(ex))
    }

    function addPhoto(event) {
        event.preventDefault();
        const { title, url, thumbnailUrl } = event.target
        const newPhoto = { albumId: album.id, id: `${nextId}`, title: title.value, url: url.value, thumbnailUrl: thumbnailUrl.value }
        fetch('http://localhost:3000/photos', {
            method: 'POST',
            body: JSON.stringify(newPhoto),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setShowAdditionForm(false)
            setNextId(prev => prev + 1)
        }).catch((ex) => alert(ex));
    }

    function deletePhoto(i, id) {
        if (confirm('Are you sure you want to delete this photo from the database?')) {
            fetch(`http://localhost:3000/photos/${id}`, {
                method: 'DELETE'
            }).then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
            }).then(() => {
                setPhotos((prev) => [...prev.slice(0, i), ...prev.slice(i + 1, prev.length)])
            }).catch((ex) => alert(ex));
        } else
            return;
    }

    function changeEditable(i) {
        setPhotos(prev => [...prev.slice(0, i), { ...prev[i], editable: !prev[i].editable }, ...prev.slice(i + 1, prev.length)])
    }

    function updatePhoto(event, i, id) {
        event.preventDefault()
        const { title, url, thumbnailUrl } = event.target;
        const updatedPhoto = { title: title.value, url: url.value, thumbnailUrl: thumbnailUrl.value }
        fetch(`http://localhost:3000/photos/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedPhoto),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setPhotos(prev => [...prev.slice(0, i), { ...prev[i], ...updatedPhoto }, ...prev.slice(i + 1, prev.length)])
            changeEditable(i)
        }).catch((ex) => alert(ex));
    }

    return (<>
        <Link onClick={() => document.removeEventListener('scroll', onScroll)} to="../.." relative="path"> <span>Back to all albums</span> </Link>
        <h3>id: {album.id}</h3>
        <h3>title: {album.title} </h3>

        <button onClick={() => (setShowAdditionForm(prev => !prev))}>Add photo</button>
        <br />
        {showAdditionForm && <form onSubmit={addPhoto}>
            <label htmlFor='title' >title</label>
            <input name='title' type='text' required></input>
            <label htmlFor='url' >url</label>
            <input name='url' type="url" required></input>
            <label htmlFor='thumbnailUrl' >thumbnail url</label>
            <input name='thumbnailUrl' type="url" required></input>
            <button type="submit">Add</button>
        </form>}

        <br />
        <h2> <ins>Photos list</ins></h2>
        <div className="allPhotos" id="header">
            {photos.length == 0 ? <h2>There are no photos</h2>
                : photos.map((photo, i) => {
                    return (
                        <form key={i} onSubmit={(event) => updatePhoto(event, i, photo.id)}>
                            <span>{photo.id}: </span>
                            {<img src={edit} onClick={() => changeEditable(i)} />}
                            <img onClick={() => deletePhoto(i, photo.id)} src={trash} />
                            {photo.editable ?
                                <>
                                    <input name="title" type="text" defaultValue={photo.title} className="nameInput" />
                                    <br />
                                    <input name="url" type="url" defaultValue={photo.url} />
                                    <br />
                                    <input name="thumbnailUrl" type="url" defaultValue={photo.thumbnailUrl} />
                                </>
                                : <div className="photosContainer">
                                    <img className="photos" src={photo.thumbnailUrl} />
                                    <span><b>title: </b> {photo.title} </span>

                                </div>}
                            {photo.editable && <button type="submit" >Update</button>}
                        </form >)
                })}
        </div>
    </>)
}

export default Photos;