import React, { useContext } from "react";
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AppContext } from "../App";
function Home() {
    const { userDetailes } = useContext(AppContext)
    // setUserDetails(JSON.parse(localStorage.getItem('currentUser')))
    // const userDetailes = JSON.parse(localStorage.getItem('currentUser'));
    const navigate = useNavigate();
    function logout() {
        localStorage.clear()
        // window.location.replace("/")
        navigate("/")
    }



    return (<>
        <h1>welcome {userDetailes.name}</h1>
        <Link to="./info" >Info</Link>
        <Link to="./todos" >Todos</Link>
        <Link to="./posts" >Posts</Link>
        <Link to="./albums">Albums</Link>
        <button onClick={logout}>Logout</button>
        <Outlet />
        {/* <Link to="/"></Link> */}
    </>);
}

export default Home;