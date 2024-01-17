import React from "react";
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';


// const Info = () => {
//     const {currentUser,} = useContext(UserContext);

//     return (
//         <>
//             <div>
//                 {print(currentUser)}
//             </div>
//         </>
//     )
// }

function Info() {
    const userDetailes = useLocation();
    const print = (myObject) => {
        return Object.keys(myObject).map((key) => (typeof myObject[key] === 'object' ?
            <div key={key} ><br /><p><ins><strong>{key + ":"}</strong></ins></p> {print(myObject[key])}</div> :
            <p key={key}><b>{key}:</b> {myObject[key]}</p>))
    }

    return (<>
    <br /><br />
        <div>
            {print(userDetailes.state)}
        </div>


        {/* map */}
        {/* <h1>information</h1>
        <p><b>name:</b> {userDetailes.state.name}</p>
        <p><b>user name:</b> {userDetailes.state.username}</p>
        <p><b>email:</b> {userDetailes.state.email}</p>
        <p><b>phone:</b> {userDetailes.state.phone}</p>
        <p><b>website:</b> {userDetailes.state.website}</p>
        <br />
        <h4>address</h4>
        <p><b>city:</b> {userDetailes.state.address.city}</p>
        <p><b>street:</b> {userDetailes.state.address.street}</p>
        <p><b>suite:</b> {userDetailes.state.address.suite}</p>
        <p><b>zipcode:</b> {userDetailes.state.address.zipcode}</p>
        <h4>geo</h4>
        <p><b>lat:</b> {userDetailes.state.address.geo.lat}</p>
        <p><b>lng:</b> {userDetailes.state.address.geo.lng}</p>
        <br />
        <h4>company</h4>
        <p><b>name:</b> {userDetailes.state.company.name}</p>
        <p><b>catch phrase:</b> {userDetailes.state.company.catchPhrase}</p>
        <p><b>bs:</b> {userDetailes.state.company.bs}</p> */}
    </>);
}

export default Info;