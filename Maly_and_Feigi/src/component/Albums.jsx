import React, { useEffect, useState, useContext, createContext } from "react";
import { useLocation, NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import trash from "../icons/trash.png"
import arrowDown from "../icons/angle-small-down.png"
import arrowUp from "../icons/angle-small-up.png"
import SingleAlbum from "./SingleAlbum";
import { AppContext } from "../App";



function Albums() {
    const navigate = useNavigate();
    // const [userAlbums, setUserAlbums] = useState([]);
    const [showAdditionForm, setShowAdditionForm] = useState(false);
    // const [editables, setEditables] = useState([]);
    // const {  } = useContext(AlbumContext);
    // const [stringSearch, setStringSearch] = useState();
    const [nextId, setNextId] = useState();
    const [searchType, setSearchType] = useState();
    const { userDetails, albums, setAlbums, userAlbums, setUserAlbums } = useContext(AppContext)

    useEffect(() => {
        //fech next id
        fetch("http://localhost:3000/nextIDs/5")
            .then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();
            })
            .then((json) => {
                setNextId(json.nextId)
            }).catch(ex => alert(ex))

        //fech albums
        fetch(`http://localhost:3000/albums?userId=${userDetails.id}`)
            .then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();
            })
            .then(data => {
                setUserAlbums(data);
                // setUserAlbums(data.map(Album => { return { ...Album, editables: false } }));
                let albumsArr = []
                for (let i = 0; i < data.length; i++)
                    albumsArr.push({ ...data[i], originalIndex: i, editable: false, AlbumDetailsView: false })
                setAlbums(albumsArr);
            }).catch(ex => alert(ex))
    }, [])

    useEffect(() => {
        if (nextId != null)
            fetch("http://localhost:3000/nextIDs/5", {
                method: "PATCH",
                body: JSON.stringify({
                    "nextId": nextId
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            })
                .then((response) => response.json())
                .then((json) => console.log(json));
    }, [nextId])

    function addingAlbum(event) {
        event.preventDefault();
        const { title, body } = event.target;
        const newAlbum = { userId: userDetails.id, id: `${nextId}`, title: title.value, body: body.value }
        fetch('http://localhost:3000/albums', {
            method: 'Album',
            body: JSON.stringify(newAlbum),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setUserAlbums(prev => [...prev, newAlbum])
            setAlbums(prev => [...prev, { ...newAlbum, originalIndex: userAlbums.length, editable: false, AlbumDetailsView: false }])
            setShowAdditionForm(false)
            setNextId(prev => prev + 1)
        }).catch((ex) => alert(ex));
    }

    function deleteAlbum(originalIndex, i, id) {
        if (confirm('Are you sure you want to delete this Album from the database?')) {
            fetch(`http://localhost:3000/albums/${id}`, {
                method: 'DELETE'
            }).then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
            }).then(() => {
                setUserAlbums((prev) => [...prev.slice(0, originalIndex), null, ...prev.slice(originalIndex + 1, prev.length)])
                setAlbums((prev) => [...prev.slice(0, i), ...prev.slice(i + 1, prev.length)])
            }).catch((ex) => alert(ex));
        } else {
            return;
        }
    }

    function changeEditable(i) {
        setAlbums(prev => [...prev.slice(0, i), { ...prev[i], editable: !prev[i].editable }, ...prev.slice(i + 1, prev.length)])
    }

    function changeAlbumDetailsView(i, Album) {
        setAlbums(prev => [...prev.slice(0, i), { ...prev[i], AlbumDetailsView: !prev[i].AlbumDetailsView }, ...prev.slice(i + 1, prev.length)])
        // navigate(`./${Album.id}`, {Album:Album,changeEditable:changeEditable,originalIndex:i})
        navigate(`./${Album.id}`)
    }

    function updateAlbum(event, originalIndex, i, id) {
        event.preventDefault()
        const { title, body } = event.target;

        fetch(`http://localhost:3000/albums/${id}`, {
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
            setUserAlbums(prev => [...prev.slice(0, originalIndex), { ...prev[originalIndex], title: title.value, body: body.value }, ...prev.slice(originalIndex + 1, prev.length)])
            setAlbums(prev => [...prev.slice(0, i), { ...prev[i], title: title.value, body: body.value }, ...prev.slice(i + 1, prev.length)])
            changeEditable(i)
        }).catch((ex) => alert(ex));
    }

    function searchAlbums(event) {
        let foundsArr;
        let foundIndex;
        switch (event.target.name) {
            case "id":
                foundIndex = userAlbums.findIndex(p => p != null && p.id == event.target.value)
                setAlbums([{ ...userAlbums[foundIndex], originalIndex: foundIndex, editable: false, albumDetailsView: false }])
                break;
            case "title":
                foundsArr = userAlbums.map((p, i) => { if (p != null && p.title.includes(event.target.value)) return { ...p, originalIndex: i, editable: false, albumDetailsView: false } })
                setAlbums(foundsArr.filter(p => p != null))
                break;
        }
    }

    function search(event) {
        let foundsArr;
        if (event.target.value == "all") {
            foundsArr = userAlbums.map((p, i) => { if (p != null) return { ...p, originalIndex: i, editable: false, albumDetailsView: false } })
            setAlbums(foundsArr.filter(p => p != null));
            setSearchType();
        }
        else
            setSearchType(event.target.value);
    }

    return (<>
        <br /><br />
        <button onClick={() => (setShowAdditionForm(prev => !prev))}>Add album</button>
        <br />

        {showAdditionForm && <form onSubmit={addingalbum}>
            <label htmlFor='title' >album title</label>
            <input name='title' type='text' required></input>
            <label htmlFor='body' >album body</label>
            <input name='body' type='text' required></input>
            <button type="submit">Add</button>
        </form>}

        <label htmlFor='search' >search by</label>
        <select onChange={search} name="search">
            <option value="all"></option>
            <option value="id">id</option>
            <option value="title">title</option>
        </select>
        <br />

        {searchType ? <input type="text" name={searchType} onChange={event => searchAlbums(event)} /> : <></>}

        <h2><ins>albums list</ins></h2>
        {albums.length == 0 ? <h2>No albums found</h2>
            : albums.map((album, i) => {
                return (album.id > -1 ?
                    <div key={i}>
                        <form onClick={() => navigate(`./${album.id}`, { state: { i } })}
                            style={album.albumDetailsView ? { backgroundColor: "rgb(180, 229, 201)", borderRadius: 10, padding: 20, margin: 20 } : {}}
                            key={i} >
                            <span style={{ marginRight: 10 }}>{album.id}: </span>
                            <span>{album.title} </span>

                            {/* {album.albumDetailsView && <Singlealbum album={album} i={i} changeEditable={changeEditable} />} */}
                            {/* <Link to={`./${album.id}`} state={{album,changeEditable,i}}><img src={arrowDown} /></Link> */}
                            {/* <Link to={`./${album.id}`} state={{ album, i }}><img src={arrowDown} /></Link> */}
                            {/* <img src={arrowDown} onClick={()=>navigate(`./${album.id}` ,{state:{ album, i }})} /> */}
                            {/* <Outlet />                         */}
                            <br /><br />
                        </form> <img onClick={() => deleteAlbum(album.originalIndex, i, album.id)} src={trash} />
                    </div>
                    : <h2>No albums found</h2>
                )
            })}
    </>);
}
export default Albums;
// album.albumDetailsView ?


// {album.editable ?
//     <input name="title" type="text" defaultValue={album.title} style={{ width: 300 }} />
//     : <span>{album.title} </span>}
// {/* <input name="completed" type="checkbox" defaultChecked={album.completed} /></> */}
// {/* <input name="completed" type="checkbox" disabled={true} checked={album.completed} /></> */}
// <img src={edit} onClick={() => changeEditable(i)} />
// <img onClick={() => deletealbum(album.i, i, album.id)} src={trash} />
// <img src={arrow} onClick={() => changealbumDetailsView(i)} />

// {album.editable && <button type="submit" >update</button>}




// {/* <form
// style={album.albumDetailsView ? { backgroundColor: "rgb(180, 229, 201)", borderRadius: 10, padding: 20, margin: 20 } : {}}
// key={i} onSubmit={(event) => updatealbum(event, album.originalIndex, i, album.id)}>

// {!album.albumDetailsView && <span style={{ marginRight: 10 }}>{album.id}: </span>}
// {!album.albumDetailsView && <span>{album.title} </span>}
// {album.albumDetailsView && <Outlet />}
// {/* {album.albumDetailsView && <Singlealbum album={album} i={i} changeEditable={changeEditable} />} */}
// <img onClick={() => deletealbum(album.originalIndex, i, album.id)} src={trash} />
// {!album.albumDetailsView && <img src={arrowDown} onClick={() => changealbumDetailsView(i, album)} />}
// {album.albumDetailsView && <img src={arrowUp} onClick={() => changealbumDetailsView(i, album)} />}
// <br /><br />
// {album.editable && album.albumDetailsView && <button type="submit" >update</button>}
// </form> : <h2>No Albums found</h2> */}