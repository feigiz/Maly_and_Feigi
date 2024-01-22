import React, { useContext, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { AppContext } from "../App";

function Register({ userIdentifyDetails }) {

    const { setUserDetails } = useContext(AppContext)
    const nextId = useRef();
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
    } = useForm();

    useEffect(() => {
        fetch("http://localhost:3000/nextIDs/1")
            .then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();
            }).then((json) => {
                nextId.current = json.nextId
            }).catch(ex => alert(ex))
    }, [])

    function updateNextId() {
        nextId.current = nextId.current + 1;
        fetch("http://localhost:3000/nextIDs/1", {
            method: "PATCH",
            body: JSON.stringify({ "nextId": nextId.current }),
            headers: { "Content-type": "application/json; charset=UTF-8" },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
            return response.json();
        }).catch((ex) => alert(ex));
    }

    function onSubmit(data) {
        const { name, email, street, suite, city, zipcode, lat, lng, phone,
            companyName, catchPhrase, bs } = data;
        fetch('http://localhost:3000/users', {
            method: 'POST',
            body: JSON.stringify({
                id: `${nextId.current}`, name: name.value, username: userIdentifyDetails.current.username, email: email.value,
                address: {
                    street: street.value, suite: suite.value, city: city.value, zipcode: zipcode.value,
                    geo: { lat: lat.value, lng: lng.value }
                },
                phone: phone.value, website: userIdentifyDetails.current.website,
                company: { name: companyName.value, catchPhrase: catchPhrase.value, bs: bs.value }
            }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
            return response.json();
        }).then(data => {
            localStorage.setItem('currentUser', JSON.stringify(data));
            updateNextId()
            setUserDetails(data)
            alert("user successfully added");
            navigate(`/home/users/${data.id}`);
        }).catch((ex) => alert(ex));
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor='name'>name</label>
            <input name='name' type='text' required {...register('name')} ></input>

            <label htmlFor='email' >email</label>
            <input name='email' type='email' required {...register('email')} ></input>

            <h4>address:</h4>
            <label htmlFor='street' >street</label>
            <input name='street' type='text' required {...register('street')}></input>
            <label htmlFor='suite' >suite</label>
            <input name='suite' type='text' required {...register('suite')}></input>
            <label htmlFor='city' >city</label>
            <input name='city' type='text' required {...register('city')}></input>
            <label htmlFor='zipcode' >zipcode</label>
            <input name='zipcode' type='text' required {...register('zipcode')}></input>
            <h4>geo:</h4>
            <label htmlFor='lat' >lat</label>
            <input name='lat' type='text' required {...register('lat')}></input>
            <label htmlFor='lng' >lng</label>
            <input name='lng' type='text' required {...register('lng')}></input>

            <label htmlFor='phone' >phone</label>
            <input name='phone' type='text' pattern="[0-9\-\+\s]{7,14}" required {...register('phone')}></input>

            <h4>company:</h4>
            <label htmlFor='companyName' >name</label>
            <input name='companyName' type='text' required {...register('companyName')}></input>
            <label htmlFor='catchPhrase' >catch phrase</label>
            <input name='catchPhrase' type='text' required {...register('catchPhrase')}></input>
            <label htmlFor='bs' >bs</label>
            <input name='bs' type='text' required {...register('bs')}></input>

            <button type='submit'>register</button>
        </form>)
}

export default Register;
