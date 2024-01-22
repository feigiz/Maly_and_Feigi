import React, { useRef, useState } from "react";
import Register from "./Register";

function Signup() {

    const [isFillingDetails, setIsFillingDetails] = useState(false);
    const userIdentifyDetails = useRef();

    function onSubmitSignUp(event) {
        event.preventDefault();
        const { name, password, verifyPassword } = event.target;
        if (password.value != verifyPassword.value)
            alert("verify failed");
        else {
            userIdentifyDetails.current = { username: name.value, website: password.value }
            console.log(userIdentifyDetails.current)
            checkUser();
        }
    }

    async function checkUser() {
        try {
            const response = await fetch(`http://localhost:3000/users?username=${userIdentifyDetails.current.username}`);
            const user = await response.json();
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
            if (!user[0])
                setIsFillingDetails(true);//when false?   
            else
                alert("existing user, please login");
        } catch (ex) { alert(ex) }
    }

    return (<>
        {!isFillingDetails && <form onSubmit={onSubmitSignUp}>

            <label htmlFor='name' >user name</label>
            <input name='name' type='text' required></input>

            <label htmlFor='password' >password</label>
            <input name='password' type='password' required></input>

            <label htmlFor='verifyPassword' >verify password</label>
            <input name='verifyPassword' type='password' required></input>

            <button type='submit'>continue</button>
        </form>}
        {isFillingDetails && <Register userIdentifyDetails={userIdentifyDetails} />}
    </>);
}

export default Signup;







































// const navigate = useNavigate();
// const [isFillingDetails, setIsFillingDetails] = useState(false);
// const userIdentifying = useRef();
// // const [userIdentifying, setUserIdentifying] = useState();

// // const [nextId, setNextId] = useState();

// const nextId = useRef();


// useEffect(() => {
//     fetch("http://localhost:3000/nextIDs/1")
//         .then(response => {
//             if (!response.ok)
//                 throw 'Error' + response.status + ': ' + response.statusText;
//             return response.json();
//         })
//         .then((json) => {
//             // setNextId(json.nextId)
//             nextId.current=json.nextId
//         }).catch(ex => alert(ex))
// }, [])

// // useEffect(() => {
// //     if (nextId.current != null)
// //         fetch("http://localhost:3000/nextIDs/1", {
// //             method: "PATCH",
// //             body: JSON.stringify({ "nextId": nextId.current }),
// //             headers: { "Content-type": "application/json; charset=UTF-8" },
// //         })
// //             .then((response) => response.json())
// //             .then((json) => console.log(json));
// // }, [nextId])

// // useEffect(() => {
// //     if (nextId != null)
// //         fetch("http://localhost:3000/nextIDs/1", {
// //             method: "PATCH",
// //             body: JSON.stringify({ "nextId": nextId }),
// //             headers: { "Content-type": "application/json; charset=UTF-8" },
// //         })
// //             .then((response) => response.json())
// //             .then((json) => console.log(json));
// // }, [nextId])


// function onSubmitSignUp(event) {
//     event.preventDefault();
//     const { name, password, verifyPassword } = event.target;
//     if (password.value != verifyPassword.value)
//         alert("verify failed");
//     else {
//         userIdentifying.current = { username: name.value, website: password.value }
//         console.log(userIdentifying.current)
//         checkUser();
//     }
// }

// async function checkUser() {
//     try {
//         const response = await fetch(`http://localhost:3000/users?username=${userIdentifying.current.username}`);
//         const user = await response.json();
//         if (!response.ok)
//             throw 'Error' + response.status + ': ' + response.statusText;
//         if (!user[0])
//             setIsFillingDetails(true);//when false?
//         else
//             alert("existing user, please login");
//     } catch (ex) { alert(ex) }
// }

// function onSubmitFullDetails(event) {
//     event.preventDefault();
//     const { name, email, street, suite, city, zipcode, lat, lng, phone,
//         companyName, catchPhrase, bs } = event.target;
//     // let Id;
//     // await fetch("http://localhost:3000/nextIDs/1")
//     //     .then((response) => {
//     //         if (!response.ok)
//     //             throw 'Error' + response.status + ': ' + response.statusText;
//     //         return response.json();
//     //     })
//     //     .then((json) => Id = json.nextId)
//     //     .catch(ex => alert(ex));
//     fetch('http://localhost:3000/users', {
//         method: 'POST',
//         body: JSON.stringify({
//             id: `${nextId.current}`, name: name.value, username: userIdentifying.current.username, email: email.value,
//             address: {
//                 street: street.value, suite: suite.value, city: city.value, zipcode: zipcode.value,
//                 geo: { lat: lat.value, lng: lng.value }
//             },
//             phone: phone.value, website: userIdentifying.current.website,
//             company: { name: companyName.value, catchPhrase: catchPhrase.value, bs: bs.value }
//         }),
//         headers: { 'Content-type': 'application/json; charset=UTF-8' },
//     }).then(response => {
//         if (!response.ok)
//             throw 'Error' + response.status + ': ' + response.statusText;
//         return response.json();
//     }).then(data => {
//         // fetch("http://localhost:3000/nextIDs/1", {
//         //     method: "PATCH",
//         //     body: JSON.stringify({ "nextId": Id + 1 }),
//         //     headers: { "Content-type": "application/json; charset=UTF-8"},
//         // }).then(response => {
//         //     if (!response.ok)
//         //         throw 'Error' + response.status + ': ' + response.statusText;
//         //     return response.json();
//         // }).catch((ex) => alert(ex));
//         // setNextId(prev => prev + 1)
//         localStorage.setItem('currentUser', JSON.stringify(data));
//         // setNextId(prev => (prev + 1))
//         nextId.current=nextId.current+1;

//         fetch("http://localhost:3000/nextIDs/1", {
//             method: "PATCH",
//             body: JSON.stringify({ "nextId": nextId.current }),
//             headers: { "Content-type": "application/json; charset=UTF-8" },
//         })
//             .then((response) => response.json())
//             .then((json) => console.log(json));
//         alert("user successfully added");
//         navigate(`/home/users/${data.id}`);
//     }).catch((ex) => alert(ex));
// }