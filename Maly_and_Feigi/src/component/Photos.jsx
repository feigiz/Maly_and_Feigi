import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import trash from "../icons/trash.png"
import edit from "../icons/edit.png"
import { AppContext } from "../App";
import { useForm } from "react-hook-form";
import useNextId from "./useNextId";

function Photos() {
    const { state } = useLocation();
    const [showAdditionForm, setShowAdditionForm] = useState(false);
    const [photos, setPhotos] = useState([]);
    const [nextId, setNextId] = useNextId(6);
    const { userDetails, albums, setAlbums, setUserAlbums } = useContext(AppContext)
    const navigate = useNavigate();
    const [showBtnMore, setShowBtnMore] = useState(true)
    const { i } = state;
    // const { register, handleSubmit, } = useForm();
    const allPhotos = useRef(null)

    let scrolling = false;

    // window.scroll = () => {
    //     scrolling = true;
    // };

    function isBottom(el) {
        return el.getBoundingClientRect().bottom <= window.innerHeight;
    }

    // function componentDidMount() {
    //     document.addEventListener('scroll', trackScrolling);
    // }

    // function componentWillUnmount() {
    //     document.removeEventListener('scroll', trackScrolling);
    // }

    function trackScrolling() {
        const wrappedElement = document.getElementById('header');
        if (isBottom(wrappedElement)) {
            console.log('header bottom reached');
            console.log(photos)
            document.removeEventListener('scroll', trackScrolling);
            addPhotos()
        }
    };
    useEffect(() => {
        //fech Photos
        fetch(`http://localhost:3000/photos?albumId=${albums[i].id}&_limit=12`)
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
                document.addEventListener('scroll', trackScrolling);
            }).catch(ex => alert(ex))

    }, [])

    function addPhotos() {
        const length = photos.length
        fetch(`http://localhost:3000/photos?albumId=${albums[i].id}&_start=${length}&_end=${length + 12}`)
            .then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();
            })
            .then(data => {
                if (data.length == 0)
                    setShowBtnMore(false)
                else {
                    let photosArr = photos.slice()
                    for (let i = 0; i < data.length; i++)
                        photosArr.push({ ...data[i], editable: false })
                    setPhotos(photosArr);
                }
            }).catch(ex => alert(ex))
    }

    function addingPhoto(event) {
        event.preventDefault();
        const { title, url, thumbnailUrl } = event.target
        const newPhoto = { albumId: albums[i].id, id: `${nextId}`, title: title.value, url: url.value, thumbnailUrl: thumbnailUrl.value }
        fetch('http://localhost:3000/photos', {
            method: 'POST',
            body: JSON.stringify(newPhoto),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
        }).then(() => {
            setPhotos(prev => [...prev, { ...newPhoto, editable: false }])
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
        } else {
            return;
        }
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
    // setInterval(() => {
    //     console.log("a")

    // },300);
    // function scrolled() {
    //     console.log("a")

    //     if (scrolling) {
    //         scrolling = false;
    //         // place the scroll handling logic here
    //     }
    //     if (allPhotos.current.offsetHeight + allPhotos.current.scrollTop >= allPhotos.current.scrollHeight) {
    //         addPhotos();
    //     }



    // }
    // .scroll(function() {
    //         if($(window).scrollTop() + $(window).height() >= $(document).height()) {
    //             console.log("bottom!");
    //         }
    //      });

    // const onscrollend = (event) => { console.log("finish") };

    return (<>
        <button onClick={() => (setShowAdditionForm(prev => !prev))}>Add photo</button>
        <br />

        {showAdditionForm && <form onSubmit={addingPhoto}>
            <label htmlFor='title' >title</label>
            <input name='title' type='text' required></input>
            <label htmlFor='url' >url</label>
            <input name='url' type='text' required></input>
            <label htmlFor='thumbnailUrl' >thumbnail url</label>
            <input name='thumbnailUrl' type='text' required></input>
            <button type="submit">Add</button>
        </form>}


        <br />
        <h2> <ins>photos list</ins></h2>
        <div ref={allPhotos} className="allPhotos" id="header">{photos.length == 0 ? <h2>There are no photos</h2>
            : photos.map((photo, i) => {
                return (
                    // <form key={i} onSubmit={handleSubmit((data) => updatePhoto(data, i, photo.id))}>
                    <form key={i} onSubmit={(event) => updatePhoto(event, i, photo.id)}>
                        <span style={{ marginRight: 10 }}>{photo.id}: </span>
                        {<img src={edit} onClick={() => changeEditable(i)} />}
                        <img onClick={() => deletePhoto(i, photo.id)} src={trash} />
                        {photo.editable ?
                            <>
                                {/* <input name="title" type="text" defaultValue={photo.title} style={{ width: 300 }} {...register('title')} />
                                <br />
                                <input name="url" type="url" defaultValue={photo.url} {...register('url')} />
                                <br />
                                <input name="thumbnailUrl" type="url" defaultValue={photo.thumbnailUrl} {...register('thumbnailUrl')} /> */}
                                <input name="title" type="text" defaultValue={photo.title} style={{ width: 300 }} />
                                <br />
                                <input name="url" type="url" defaultValue={photo.url} />
                                <br />
                                <input name="thumbnailUrl" type="url" defaultValue={photo.thumbnailUrl} />
                            </>
                            : <div className="photosContainer">
                                {/* <br /> */}
                                <img className="photos" src={photo.thumbnailUrl} />
                                <span><b>title: </b> {photo.title} </span>

                            </div>}
                        {photo.editable && <button type="submit" >update</button>}
                        {/* <br /><br /> */}
                    </form >)
            })}</div>
        {/* {showBtnMore && <button onClick={addPhotos}>more</button>} */}
    </>)

}

export default Photos;




//קטן שווה זה _lte   id_gte=0
//הפקודה בפץ תתן 10 ראשונים. נראה לי שהגדול והקטן לא עובדים אצלנו כי המספרים מחרוזות
//את יכולה להריץ את הפקודה בעוד 2 שורות ולראות 10 תמונות עם אי די מעל 10
//https://jsonplaceholder.typicode.com/photos?albumId=1&id_gte=10&_limit=10



