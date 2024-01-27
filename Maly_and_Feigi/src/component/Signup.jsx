import React, { useRef, useState } from "react";
import RegisterDetails from "./RegisterDetails";
import { useForm } from "react-hook-form";

function Signup() {
    const [isRegisterDetails, setIsRegisterDetails] = useState(false);
    const userIdentifyDetails = useRef();
    const { register, handleSubmit } = useForm()

    function onSubmitSignUp(data) {
        const { name, password, verifyPassword } = data;
        if (password != verifyPassword)
            alert("verify failed");
        else {
            userIdentifyDetails.current = { username: name, website: password }
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
                setIsRegisterDetails(true);
            else
                throw 'existing user, please login'
        } catch (ex) { alert(ex) }
    }

    return (<>
        {!isRegisterDetails && <form onSubmit={handleSubmit(onSubmitSignUp)}>

            <label htmlFor='name' >user name</label>
            <input name='name' type='text' required  {...register('name')}></input>

            <label htmlFor='password' >password</label>
            <input name='password' type='password' required {...register('password')}></input>

            <label htmlFor='verifyPassword' >verify password</label>
            <input name='verifyPassword' type='password' required {...register('verifyPassword')}></input>

            <button type='submit'>continue</button>
        </form>}
        {isRegisterDetails && <RegisterDetails userIdentifyDetails={userIdentifyDetails} />}
    </>);
}

export default Signup;