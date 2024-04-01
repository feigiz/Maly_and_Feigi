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
            //  const response = await fetch(`http://localhost:8080/users?username=${name}&&website=${password}`);


            // function addTodo(event) {
            //     event.preventDefault();
            //     const newTodo = { userId: userDetails.id, id: `${nextId}`, title: event.target[0].value, completed: false }
            //     fetch('http://localhost:3000/todos', {
            //         method: 'POST',
            //         body: JSON.stringify(newTodo),
            //         headers: { 'Content-type': 'application/json; charset=UTF-8' },
            //     }).then(response => {
            //         if (!response.ok)
            //             throw 'Error' + response.status + ': ' + response.statusText;
            //     }).then(() => {
            //         setOriginalTodos(prev => [...prev, newTodo])
            //         setTodos(prev => [...prev, { ...newTodo, originalIndex: originalTodos.length, editable: false }])
            //         setShowAdditionForm(false)
            //         setNextId(prevId => prevId + 1)
            //     }).catch((ex) => alert(ex));
            // }


            const response = await fetch(`http://localhost:3000/users?username=${name}&&website=${password}`);
            const json = await response.json();
            const user = await json[0];
            if (!user)
                throw 'incorrect data, you have to signup'
            else {
                setUserDetails(user);
                localStorage.setItem('currentUser', JSON.stringify(user));
                navigate(`/home/users/${user.id}`);
            }
        }
        catch (ex) {

        }
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