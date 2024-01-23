import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { AppContext } from "../App";

function Login() {
    const { setUserDetails } = useContext(AppContext)
    const navigate = useNavigate();
    const { register, handleSubmit } = useForm();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        if (currentUser != null) {
            navigate(`/home/users/${currentUser.id}`);
            setUserDetails(currentUser)
        }
    }, [])

    async function loginUser(name, password) {
        try {
            const response = await fetch(`http://localhost:3000/users?username=${name}&&website=${password}`);
            const json = await response.json();
            const user = await json[0];
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
            if (!user)
                alert("incorrect data, you have to signup");
            else {
                delete user.website;
                setUserDetails(user);
                localStorage.setItem('currentUser', JSON.stringify(user));
                navigate(`/home/users/${user.id}`);
            }
        } catch (ex) { alert(ex) }
    }

    return (<>
        <form onSubmit={handleSubmit((data => loginUser(data.name, data.password)))}>
            <label htmlFor='name' >user name</label>
            <input name='name' type='text' required {...register('name')}></input>
            <label htmlFor='password' >password</label>
            <input name='password' type='password' required {...register('password')}></input>
            <button type='submit'>enter</button>
        </form>
    </>)
}

export default Login;