import React,{useContext} from "react";
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AppContext } from "../App";


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
    const {userDetails} =useContext(AppContext)
   
    // const userDetails = useLocation();
    const print = (myObject) => {
        return Object.keys(myObject).map((key) => (typeof myObject[key] === 'object' ?
            <div key={key} ><br /><p><ins><strong>{key + ":"}</strong></ins></p> {print(myObject[key])}</div> :
            <p key={key}><b>{key}:</b> {myObject[key]}</p>))
    }

    return (<>
    <br /><br />
        <div>
            {print(userDetails)}
        </div>


        {/* map */}
        {/* <h1>information</h1>
        <p><b>name:</b> {userDetails.state.name}</p>
        <p><b>user name:</b> {userDetails.state.username}</p>
        <p><b>email:</b> {userDetails.state.email}</p>
        <p><b>phone:</b> {userDetails.state.phone}</p>
        <p><b>website:</b> {userDetails.state.website}</p>
        <br />
        <h4>address</h4>
        <p><b>city:</b> {userDetails.state.address.city}</p>
        <p><b>street:</b> {userDetails.state.address.street}</p>
        <p><b>suite:</b> {userDetails.state.address.suite}</p>
        <p><b>zipcode:</b> {userDetails.state.address.zipcode}</p>
        <h4>geo</h4>
        <p><b>lat:</b> {userDetails.state.address.geo.lat}</p>
        <p><b>lng:</b> {userDetails.state.address.geo.lng}</p>
        <br />
        <h4>company</h4>
        <p><b>name:</b> {userDetails.state.company.name}</p>
        <p><b>catch phrase:</b> {userDetails.state.company.catchPhrase}</p>
        <p><b>bs:</b> {userDetails.state.company.bs}</p> */}
    </>);
}

export default Info;