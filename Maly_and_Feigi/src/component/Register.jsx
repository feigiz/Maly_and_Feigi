import React from "react";
import { useNavigate, Link, useParams, useLocation, Route } from 'react-router-dom';
function Register({ onSubmitFullDetails }) //Search Params / Link state and useLocation in scrimba for user detiles
{
    return(
    <form onSubmit={(event) => { onSubmitFullDetails(event) }}>
            <label htmlFor='name'>name</label>
            <input name='name' type='text' required ></input>

            <label htmlFor='email' >email</label>
            <input name='email' type='email' required ></input>

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
            <input name='phone' type='text' pattern="[0-9\-\+\s]{7,14}" required></input>

            <h4>company:</h4>
            <label htmlFor='companyName' >name</label>
            <input name='companyName' type='text' required></input>
            <label htmlFor='catchPhrase' >catch phrase</label>
            <input name='catchPhrase' type='text' required></input>
            <label htmlFor='bs' >bs</label>
            <input name='bs' type='text' required></input>

            <button type='submit'>register</button>
        </form>)
}
export default Register;
