import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { AppContext } from "../App";
import useNextId from "./useNextId";

function RegisterDetails({ userIdentifyDetails }) {

    const { setUserDetails } = useContext(AppContext)
    const navigate = useNavigate()
    const [nextId, setNextId] = useNextId(1)

    const { register, handleSubmit } = useForm();

    function onSubmitFullDetails(data) {
        const { name, email, street, suite, city, zipcode, lat, lng, phone,
            companyName, catchPhrase, bs } = data;
        fetch('http://localhost:3000/users', {
            method: 'POST',
            body: JSON.stringify({
                id: `${nextId}`, name: name, username: userIdentifyDetails.current.username, email: email,
                address: {
                    street: street, suite: suite, city: city, zipcode: zipcode,
                    geo: { lat: lat, lng: lng }
                },
                phone: phone, website: userIdentifyDetails.current.website,
                company: { name: companyName, catchPhrase: catchPhrase, bs: bs }
            }),
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
        }).then(response => {
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
            return response.json();
        }).then(data => {
            delete data.website
            localStorage.setItem('currentUser', JSON.stringify(data));
            setUserDetails(data)
            alert("user successfully added");
            navigate(`/home/users/${data.id}`);
        }).catch((ex) => alert(ex));
        setNextId(prev => prev + 1)
    }

    return (
        <form onSubmit={handleSubmit(onSubmitFullDetails)}>
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

export default RegisterDetails;
