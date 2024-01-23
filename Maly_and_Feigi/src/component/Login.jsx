import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { AppContext } from "../App";


function Login() {
    const { setUserDetails } = useContext(AppContext)

    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
    } = useForm();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        if (currentUser != null) {
            navigate(`/home/users/${currentUser.id}`);
            setUserDetails(currentUser)
        }
    }, [])

    

    async function checkUser(name, password) {
        try {
            const response = await fetch(`http://localhost:3000/users?username=${name}&&website=${password}`);
            const user = await response.json();
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
            if (!user[0])
                alert("incorrect data, you have to signup");
            else {
                // console.log(user[0])
                delete user[0].website
                localStorage.setItem('currentUser', JSON.stringify(user[0]));
                navigate(`/home/users/${user[0].id}`);
                setUserDetails(user[0])
            }
        } catch (ex) { alert(ex) }
    }
// style={{marginTop:500}}
    return (<>
        <form  onSubmit={handleSubmit((data => checkUser(data.name, data.password)))}>
            <label htmlFor='name' >user name</label>
            <input name='name' type='text' required {...register('name')}></input>
            <label htmlFor='password' >password</label>
            <input name='password' type='password' required {...register('password')}></input>
            <button type='submit'>enter</button>
        </form>
    </>)
}

export default Login;