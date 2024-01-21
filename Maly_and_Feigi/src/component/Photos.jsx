import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import trash from "../icons/trash.png"
import edit from "../icons/edit.png"
import { AppContext } from "../App";
import X from "../icons/X.png"


function Photos() {
    const { state } = useLocation();
    const [userPhotos, setUserPhotos] = useState([]);
    const [showAdditionForm, setShowAdditionForm] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [nextId, setNextId] = useState();
    const { userDetails, albums, setAlbums, setUserAlbums } = useContext(AppContext)
    const navigate = useNavigate();
    const {i}=state;


    useEffect(() => {
        //fech next id
        fetch("http://localhost:3000/nextIDs/4")
            .then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();
            })
            .then((json) => {
                setNextId(json.nextId)
            }).catch(ex => alert(ex))


        //fech Photos
        fetch(`http://localhost:3000/photos?albumId=${albums[i].id}`)
            .then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();
            })
            .then(data => {
                setUserPhotos(data);
                let photosArr = []
                for (let i = 0; i < data.length; i++)
                    photosArr.push({ ...data[i], i: i, editable: false })
                setPhotos(photosArr);
            }).catch(ex => alert(ex))
    }, [])

    useEffect(() => {
        if (nextId != null)
            fetch("http://localhost:3000/nextIDs/4", {
                method: "PATCH",
                body: JSON.stringify({
                    "nextId": nextId
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            })
                .then((response) => {
                    if (!response.ok)
                        throw 'Error' + response.status + ': ' + response.statusText;
                    return response.json();
                })
                .then((json) => console.log(json))
                .catch(ex => alert(ex));
    }, [nextId])

    function addingPhoto(event) {
        event.preventDefault();
        const { name, body } = event.target
        const newPhoto = { albumId: albums[i].id, id: `${nextId}`, name: name.value, email: userDetails.email, body: body.value }
        fetch('http://localhost:3000/photos', {
            method: 'Album',
            body: JSON.stringify(newPhoto),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setUserPhotos(prev => [...prev, newPhoto])
            setPhotos(prev => [...prev, { ...newPhoto, i: userPhotos.length, editable: false }])
            setShowAdditionForm(false)
            setNextId(prev => prev + 1)
        }).catch((ex) => alert(ex));
    }

    function deletePhoto(Index, i, id) {
        if (confirm('Are you sure you want to delete this photo from the database?')) {
            fetch(`http://localhost:3000/photos/${id}`, {
                method: 'DELETE'
            }).then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
            }).then(() => {
                setUserPhotos((prev) => [...prev.slice(0, Index), null, ...prev.slice(Index + 1, prev.length)])
                setPhotos((prev) => [...prev.slice(0, i), ...prev.slice(i + 1, prev.length)])
            }).catch((ex) => alert(ex));
        } else {
            return;
        }
    }

    function changeEditable(i) {
        setPhotos(prev => [...prev.slice(0, i), { ...prev[i], editable: !prev[i].editable }, ...prev.slice(i + 1, prev.length)])
    }

    function updatePhoto(event, index, i, id) {
        event.preventDefault()
        const { title, completed } = event.target;
        fetch(`http://localhost:3000/photos/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({
                title: title.value,
                completed: completed.checked
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setUserPhotos(prev => [...prev.slice(0, index), { ...prev[index], title: title.value, completed: completed.value }, ...prev.slice(index + 1, prev.length)])
            setPhotos(prev => [...prev.slice(0, i), { ...prev[i], title: title.value, completed: completed.value }, ...prev.slice(i + 1, prev.length)])
            changeEditable(i)
        }).catch((ex) => alert(ex));
    }

    return (<>
        <img src={X} onClick={() => navigate("..",{state: { i }})} /><br /><br />
        <button onClick={() => (setShowAdditionForm(prev => !prev))}>Add photo</button>
        <br />

        {showAdditionForm && <form onSubmit={addingPhoto}>
            <label htmlFor='name' >name</label>
            <input name='name' type='text' required></input>
            <label htmlFor='body' >body</label>
            <input name='body' type='text' required></input>
            <button type="submit">Add</button>
        </form>}
        <br />
        <h2> <ins>photos list</ins></h2>
        {photos.length == 0 ? <h2>There are no photos</h2>
            : photos.map((photo, i) => {
                return (
                    <form key={i} onSubmit={(event) => updatePhoto(event, photo.i, i, photo.id)}>
                        <span style={{ marginRight: 10 }}>{photo.id}: </span>
                        {photo.editable ? <>
                            <input name="name" type="text" defaultValue={photo.name} style={{ width: 300 }} />
                            <br />
                            <input name="body" type="text" defaultChecked={photo.body} /></>
                            : <><span><b>name: </b> {photo.name} </span>
                                <br />
                                <span><b>body: </b> {photo.body} </span> </>}
                        {userDetails.email == photo.email && <img src={edit} onClick={() => changeEditable(i)} />}
                        <img onClick={() => deletePhoto(photo.i, i, photo.id)} src={trash} />
                        {photo.editable && <button type="submit" >update</button>}
                        <br /><br />
                    </form>)
            })}</>)
}

export default Photos;








