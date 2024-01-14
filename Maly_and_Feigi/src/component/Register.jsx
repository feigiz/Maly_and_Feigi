import React from "react";
import { useNavigate, Link, useParams, useLocation, Route } from 'react-router-dom';
function Register({ userDetails, nextId, setNextId }) {//Search Params / Link state and useLocation in scrimba for user detiles
    const navigate = useNavigate();
    // const { username, website } = useParams();
    // async function nextId(){
    //     const response = await fetch('http://localhost:3000/users?_count');
    //     console.log(response.json());
    // }
    // nextId();
    function onSubmit(event) {
        const { name, email, street, suite, city, zipcode, lat, lng, phone,
            companyName, catchPhrase, bs } = event.target;
        // console.log(event.target.elements.map(prop=>prop.value));
        try {
            fetch('http://localhost:3000/users', {
                method: 'POST',
                body: JSON.stringify({
                    id: nextId,
                    name: name.value,
                    username: userDetails.username,
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
                    website: userDetails.website,
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
            });
            alert("user successfully added")
            setNextId(prevId => prevId + 1)
            //local storage
            navigate('/home');
        } catch (ex) { alert(ex); }
    }
    return (<>
        <form onSubmit={onSubmit}>
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

            <label htmlFor='phone' >phone</label>
            <input name='phone' type='text' required></input>

            <h4>company:</h4>
                <label htmlFor='companyName' >name</label>
                <input name='companyName' type='text' required></input>
                <label htmlFor='catchPhrase' >catch phrase</label>
                <input name='catchPhrase' type='text' required></input>
                <label htmlFor='bs' >bs</label>
                <input name='bs' type='text' required></input>

            <button type='submit'>enter</button>
        </form>
    </>);
}
export default Register;

// "id": 1,
//           "name": "Leanne Graham",
//           "username": "Bret",
//           "email": "Sincere@april.biz",
//           "address": {
//             "street": "Kulas Light",
//             "suite": "Apt. 556",
//             "city": "Gwenborough",
//             "zipcode": "92998-3874",
//             "geo": {
//               "lat": "-37.3159",
//               "lng": "81.1496"
//             }
//           },
//           "phone": "1-770-736-8031 x56442",
//           "website": "hildegard.org",
//           "company": {
//             "name": "Romaguera-Crona",
//             "catchPhrase": "Multi-layered client-server neural-net",
//             "bs": "harness real-time e-markets"
//           }