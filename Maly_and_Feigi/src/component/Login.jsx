import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useForm } from "react-hook-form";
import { AppContext } from "../App";


function Login() {
    const { userDetailes, setUserDetails } = useContext(AppContext)

    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        if (currentUser != null) {
            navigate(`/home/users/${currentUser.id}`);
            setUserDetails(currentUser)
        }
    }, [])

    // const {
    //     register,
    //     handleSubmit,
    //     formState: { errors }
    // } = useForm();

    // const onSubmit = (event) => {
    //     event.preventDefault();
    //     const { name, password } = event.target;
    //     checkUser(name.value, password.value);
    // };

    function onSubmit(event) {
        event.preventDefault();
        const { name, password } = event.target;
        checkUser(name.value, password.value);
    }

    async function checkUser(name, password) {
        try {
            const response = await fetch(`http://localhost:3000/users?username=${name}&&website=${password}`);
            const user = await response.json();
            if (!response.ok)
                throw 'Error' + response.status + ': ' + response.statusText;
            if (!user[0])
                alert("incorrect data, you have to signup");
            else {
                console.log(user[0])
                localStorage.setItem('currentUser', JSON.stringify(user[0]));
                navigate(`/home/users/${user[0].id}`);
                setUserDetails(user[0])
            }
        } catch (ex) { alert(ex) }
    }


    return (<>
        <form onSubmit={onSubmit}>
            <label htmlFor='name' >user name</label>
            <input name='name' type='text' required></input>
            <label htmlFor='password' >password</label>
            <input name='password' type='password' required></input>
            <button type='submit'>enter</button>
        </form>
    </>)
    // return (<>
    //     <form onSubmit={handleSubmit(onSubmit)}>
    //         <label htmlFor='name' >user name</label>
    //         <input name='name' type='text' required {...register('name')}></input>
    //         <label htmlFor='password' >password</label>
    //         <input name='password' type='password' required {...register('password')}></input>
    //         <button type='submit'>enter</button>
    //     </form>
    // </>)
}

export default Login;