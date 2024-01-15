import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';

function Signup({ nextId, setNextId }) {
    const navigate = useNavigate();
    const [isFillingDetails, setIsFillingDetails] = useState(false);
    let userName, website;

    function onSubmitSignUp(event) {
        event.preventDefault();
        const { name, password, verifyPassword } = event.target;
        userName = name.value;
        website = password.value;
        if (website != verifyPassword.value)
            alert("verify failed");
        else
            checkUser();
    }

    async function checkUser() {
        const response = await fetch(`http://localhost:3000/users?username=${userName}&&website=${website}`);
        const user = await response.json();
        // if (!response.ok)
        //     throw 'Error' + response.status + ': ' + response.statusText;
        if (!user[0])
            setIsFillingDetails(true);//when false?   
        else
            alert("existing user, please login");
    }

    function getNextId() {
        fetch("http://localhost:3000/nextUserID", {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                return json[0].nextId
            });
    }

    function setNextId(id) {
        fetch("http://localhost:3000/nextUserID/1", {
            method: "PATCH",
            body: JSON.stringify({
                "nextId": id
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8",
            },
        })
            .then((response) => response.json())
            .then((json) => console.log(json));

    }

    function onSubmitFillingDetails(event) {
        const id = getNextId();
        event.preventDefault();
        const { name, email, street, suite, city, zipcode, lat, lng, phone,
            companyName, catchPhrase, bs } = event.target;
        try {
            fetch('http://localhost:3000/users', {
                method: 'POST',
                body: JSON.stringify({
                    id: id,
                    name: name.value,
                    username: userName,
                    email: email.value,
                    address: {
                        street: street.value,
                        suite: suite.value,
                        city: city.value,
                        zipcode: zipcode.value,
                        geo: {
                            lat: lat.value,
                            lng: lng.value
                        }
                    },
                    phone: phone.value,
                    website: website,
                    company: {
                        name: companyName.value,
                        catchPhrase: catchPhrase.value,
                        bs: bs.value
                    }
                }),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            }).then(response => {
                if (!response.ok) {
                    throw 'Error' + response.status + ': ' + response.statusText;
                }
                else {
                    return response.json();

                }
            }).then(data => {
                setNextId(data.id);
                localStorage.setItem('currentUser', JSON.stringify(data));
                alert("user successfully added");
                navigate(`/home/users/${data.id}`);
            });

        } catch (ex) { alert(ex); }
    }

    return (<>
        <form onSubmit={onSubmitSignUp}>
            <label htmlFor='name' >user name</label>
            <input name='name' type='text' required></input>

            <label htmlFor='password' >password</label>
            <input name='password' type='password' required></input>

            <label htmlFor='verifyPassword' >verify password</label>
            <input name='verifyPassword' type='password' required></input>

            {!isFillingDetails && <button type='submit'>continue</button>}
        </form>

        {isFillingDetails && <form onSubmit={onSubmitFillingDetails}>
            <label htmlFor='name' >name</label>
            <input name='name' type='text' required></input>

            <label htmlFor='email' >email</label>
            <input name='email' type='email' required></input>

            <h4>address:</h4>
            <label htmlFor='street' >street</label>
            <input name='street' type='text' required></input>
            <label htmlFor='suite' >suite</label>
            <input name='suite' type='text' required></input>
            <label htmlFor='city' >city</label>
            <input name='city' type='text' required></input>
            <label htmlFor='zipcode' >zipcode</label>
            <input name='zipcode' type='text' required></input>
            <h4>geo:</h4>
            <label htmlFor='lat' >lat</label>
            <input name='lat' type='text' required></input>
            <label htmlFor='lng' >lng</label>
            <input name='lng' type='text' required></input>

            {/* <label htmlFor='phone' >phone</label>
            <input name='phone' type='tel' minLength="9" maxlength="10" required></input> */}
            <label htmlFor='phone' >phone</label>
            <input name='phone' type='text' required></input>

            <h4>company:</h4>
            <label htmlFor='companyName' >name</label>
            <input name='companyName' type='text' required></input>
            <label htmlFor='catchPhrase' >catch phrase</label>
            <input name='catchPhrase' type='text' required></input>
            <label htmlFor='bs' >bs</label>
            <input name='bs' type='text' required></input>

            <button type='submit'>register</button>
        </form>}
    </>);
}

export default Signup;