import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';


function Login() {

    const navigate = useNavigate();

    function onSubmit(event) {
        event.preventDefault();
        const { name, password } = event.target;
        checkUser(name.value, password.value);
    }

    async function checkUser(name, password) {
        const response = await fetch(`http://localhost:3000/users?username=${name}&&website=${password}`);
        const user = await response.json();
        if (!user[0]) {
            alert("incorrect data, you have to signup");
        }
        else {
            console.log(user[0])
            localStorage.setItem('currentUser',JSON.stringify(user[0]) );
            navigate(`/home/users/${user[0].id}`);
        }
    }

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        if (currentUser != null)
            navigate(`/home/users/${currentUser.id}`);
    }, [])

    return (<>
        <form onSubmit={onSubmit}>
            <label htmlFor='name' >user name</label>
            <input name='name' type='text' required></input>
            <label htmlFor='password' >password</label>
            <input name='password' type='password' required></input>
            <button type='submit'>enter</button>
        </form>
    </>)

}

export default Login;