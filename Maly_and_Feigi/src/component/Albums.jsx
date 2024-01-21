import React, { useEffect, useState, useContext, createContext } from "react";
import { useLocation, NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import trash from "../icons/trash.png"
import arrowDown from "../icons/angle-small-down.png"
import arrowUp from "../icons/angle-small-up.png"
import SingleAlbum from "./SingleAlbum";
import { AppContext } from "../App";

function Albums() {
    const navigate = useNavigate();
    const [showAdditionForm, setShowAdditionForm] = useState(false);
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
                    albumsArr.push({ ...data[i], originalIndex: i })
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
        const { title } = event.target;
        const newAlbum = { userId: userDetails.id, id: `${nextId}`, title: title.value }
        fetch('http://localhost:3000/albums', {
            method: 'Album',
            body: JSON.stringify(newAlbum),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setUserAlbums(prev => [...prev, newAlbum])
            setAlbums(prev => [...prev, { ...newAlbum, originalIndex: userAlbums.length }])
            setShowAdditionForm(false)
            setNextId(prev => prev + 1)
        }).catch((ex) => alert(ex));
    }

    function searchAlbums(event) {
        let foundsArr;
        let foundIndex;
        switch (event.target.name) {
            case "id":
                foundIndex = userAlbums.findIndex( a =>  a != null &&  a.id == event.target.value)
                setAlbums([{ ...userAlbums[foundIndex], originalIndex: foundIndex }])
                break;
            case "title":
                foundsArr = userAlbums.map(( a, i) => { if ( a != null &&  a.title.includes(event.target.value)) return { ... a, originalIndex: i } })
                setAlbums(foundsArr.filter( a =>  a != null))
                break;
        }
    }

    function search(event) {
        let foundsArr;
        if (event.target.value == "all") {
            foundsArr = userAlbums.map(( a, i) => { if ( a != null) return { ... a, originalIndex: i } })
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

        {showAdditionForm && <form onSubmit={addingAlbum}>
            <label htmlFor='title' >album title</label>
            <input name='title' type='text' required></input>
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
                        <form onClick={() => navigate(`./${album.id}`, { state: { i } })} key={i} >
                            <span style={{ marginRight: 10 }}>{album.id}: </span>
                            <span>{album.title} </span>
                            {/* {album.albumDetailsView && <Singlealbum album={album} i={i} changeEditable={changeEditable} />} */}
                            {/* <Link to={`./${album.id}`} state={{album,changeEditable,i}}><img src={arrowDown} /></Link> */}
                            {/* <Link to={`./${album.id}`} state={{ album, i }}><img src={arrowDown} /></Link> */}
                            {/* <img src={arrowDown} onClick={()=>navigate(`./${album.id}` ,{state:{ album, i }})} /> */}
                            {/* <Outlet />*/}
                            <br /><br />
                        </form>
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