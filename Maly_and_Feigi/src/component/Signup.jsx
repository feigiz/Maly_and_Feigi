import React from "react";
import { useNavigate, Link } from 'react-router-dom';

function Signup({setUserDetails}) {
    const navigate = useNavigate();

    function onSubmit(event) {
        event.preventDefault();
        const { name, password, verifyPassword } = event.target;
        const arrUsers = JSON.parse(localStorage.getItem('Users')) || [];
        if (password.value != verifyPassword.value)
            alert("verify failed");
        else if (arrUsers.find(user => (user.name === name.value && user.password === password.value)))
            alert("existing user, please login");//מאובטח?
        else
            getUser(name.value, password.value);
    }

    async function getUser(name, password) {////ולהחליף שם לבדוק אם מותר
        const response = await fetch(`http://localhost:3000/users?username=${name}&&website=${password}`);
        const user = await response.json();
        if (!user[0]){
            setUserDetails({username:name, website:password})
                  navigate("/register");      
        }

        else
            alert("existing user, please login");
    }

    return (<>
        <form onSubmit={onSubmit}>
            <label htmlFor='name' >user name</label>
            <input name='name' type='text' required></input>

            <label htmlFor='password' >password</label>
            <input name='password' type='password' required></input>

            <label htmlFor='verifyPassword' >verify password</label>
            <input name='verifyPassword' type='password' required></input>

            <button type='submit'>enter</button>
        </form>
        <Link to="/login">log in</Link>
    </>);
}

export default Signup;