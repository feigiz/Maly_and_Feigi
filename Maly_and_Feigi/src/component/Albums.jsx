import React, { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { AppContext } from "../App";
import useNextId from "./useNextId";

function Albums() {
    const [showAdditionForm, setShowAdditionForm] = useState(false);
    const [nextId, setNextId] = useNextId(5);
    const [searchType, setSearchType] = useState();
    const { userDetails, albums, setAlbums, originalAlbums, setOriginalAlbums } = useContext(AppContext)

    useEffect(() => {
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

    function addAlbum(event) {
        event.preventDefault();
        const { title } = event.target;
        const newAlbum = { userId: userDetails.id, id: `${nextId}`, title: title.value }
        fetch('http://localhost:3000/albums', {
            method: 'POST',
            body: JSON.stringify(newAlbum),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setOriginalAlbums(prev => [...prev, newAlbum])
            setAlbums(prev => [...prev, { ...newAlbum, originalIndex: originalAlbums.length }])
            setShowAdditionForm(false)
            setNextId(prev => prev + 1)
        }).catch((ex) => alert(ex));
    }

    function searchAlbums(event) {
        let foundsArr;
        let foundIndex;
        switch (event.target.name) {
            case "id":
                foundIndex = originalAlbums.findIndex(a => a != null && a.id == event.target.value)
                setAlbums([{ ...originalAlbums[foundIndex], originalIndex: foundIndex }])
                break;
            case "title":
                foundsArr = originalAlbums.map((a, i) => { if (a != null && a.title.includes(event.target.value)) return { ...a, originalIndex: i } })
                setAlbums(foundsArr.filter(a => a != null))
                break;
        }
    }

    function selectSearchType(event) {
        let foundsArr;
        if (event.target.value == "all") {
            foundsArr = originalAlbums.map((a, i) => { if (a != null) return { ...a, originalIndex: i } })
            setAlbums(foundsArr.filter(a => a != null));
            setSearchType();
        }
        else
            setSearchType(event.target.value);
    }

    return (<>
        <br /><br />
        <button onClick={() => (setShowAdditionForm(prev => !prev))}>Add album</button>
        <br />
        {showAdditionForm && <form onSubmit={addAlbum}>
            <label htmlFor='title' >album title</label>
            <input name='title' type='text' required></input>
            <button type="submit">Add</button>
        </form>}

        <label htmlFor='search' >search by</label>
        <select onChange={selectSearchType} name="search">
            <option value="all"></option>
            <option value="id">id</option>
            <option value="title">title</option>
        </select>
        <br />
        {searchType ? <input type="text" name={searchType} onChange={event => searchAlbums(event)} /> : <></>}

        <h1><ins>Albums list</ins></h1>
        {albums.length == 0 ? <h2>No albums found</h2>
            : albums.map((album, i) => {
                return (album.id > -1 ?
                    <Link key={i} className="albumContainer" to={`./${album.id}/photos`} state={{ i }} >
                        <span>{album.id}: </span>
                        <span>{album.title} </span>
                    </Link >
                    : <h2>No albums found</h2>
                )
            })}
    </>);
}

export default Albums;