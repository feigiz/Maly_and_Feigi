import React, { useState } from 'react';
import {Link,  useNavigate } from 'react-router-dom';


function Login() {

    const navigate = useNavigate();

    function onSubmit(event) {
        event.preventDefault();
        const { name, password } = event.target;
        const arrUsers = JSON.parse(localStorage.getItem('Users')) || [];
        if (arrUsers.find(user => (user.name === name.value && user.password === password.value)))
            navigate('/home');
        else
            getUser(name.value, password.value);
    }

    async function getUser(name, password) {////ולהחליף שם לבדוק אם מותר
        const response = await fetch(`http://localhost:3000/users?username=${name}&&website=${password}`);
        const user = await response.json();
        if (!user[0]) {
            alert("incorrect data, you have to signup");
        }
        else {
            arrUsers.push({ name: name, password: password });
            localStorage.setItem('Users', JSON.stringify(arrUsers));
            navigate('/home');
        }
    }

    return (<>
        <form onSubmit={onSubmit}>
            <label htmlFor='name' >name</label>
            <input name='name' type='text' required></input>
            <label htmlFor='password' >password</label>
            <input name='password' type='password' required></input>
            <button type='submit'>enter</button>
        </form>
        <Link to="/signup">sign up</Link>
    </>)

}

export default Login;