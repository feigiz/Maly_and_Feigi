import React, { useContext, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AppContext } from "../App";
function Home() {
    const { userDetails, setUserDetails } = useContext(AppContext)
    // setUserDetails(JSON.parse(localStorage.getItem('currentUser')))
    // const userDetails = JSON.parse(localStorage.getItem('currentUser'));
    const navigate = useNavigate();

    function logout() {
        localStorage.clear()
        navigate("/")
    }

    useEffect(() => {
        if (userDetails == null)
            setUserDetails(JSON.parse(localStorage.getItem('currentUser')))
    }, [])

    return (userDetails && <>
        <h1>welcome {userDetails.name}</h1>
        <NavLink to="./info"
                style={({ isActive }) => isActive ? { border: "3px solid green", borderRadius: "10px", padding: "10px" } : {}}>
                Info</NavLink>
        <NavLink to="./todos"
                style={({ isActive }) => isActive ? { border: "3px solid green", borderRadius: "10px", padding: "10px" } : {}}>
                Todos</NavLink>
        <NavLink to="./posts"
                style={({ isActive }) => isActive ? { border: "3px solid green", borderRadius: "10px", padding: "10px" } : {}}>
                Posts</NavLink>
        <NavLink to="./albums"
                style={({ isActive }) => isActive ? { border: "3px solid green", borderRadius: "10px", padding: "10px" } : {}}>
                Albums</NavLink>
        <button onClick={logout}>Logout</button>
        <Outlet />
    </>);
}

export default Home;