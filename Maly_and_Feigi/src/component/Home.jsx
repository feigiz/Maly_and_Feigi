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
                <button onClick={logout}>Logout</button>
                <br /><br />
                <nav>
        <NavLink to="./info"
                style={({ isActive }) => isActive ? { backgroundColor:"rgb(224, 214, 239)" } : {}}>
                Info</NavLink>
        <NavLink to="./todos"
                style={({ isActive }) => isActive ? { backgroundColor:"rgb(224, 214, 239)" } : {}}>
                Todos</NavLink>
        <NavLink to="./posts"
                style={({ isActive }) => isActive ? { backgroundColor:"rgb(224, 214, 239)" } : {}}>
                Posts</NavLink>
        <NavLink to="./albums"
                style={({ isActive }) => isActive ? { backgroundColor:"rgb(224, 214, 239)" } : {}}>
                Albums</NavLink>
        </nav>
                {/* <nav>
                        <NavLink to="./info">Info</NavLink>
                        <NavLink to="./todos">Todos</NavLink>
                        <NavLink to="./posts">Posts</NavLink>
                        <NavLink to="./albums">Albums</NavLink>
                </nav> */}
                <Outlet />
        </>);
}

export default Home;