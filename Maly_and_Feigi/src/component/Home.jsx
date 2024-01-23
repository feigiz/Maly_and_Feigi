import React, { useContext, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useParams } from 'react-router-dom';
import { AppContext } from "../App";

function Home() {
        const { userDetails, setUserDetails } = useContext(AppContext)
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
                <h1>Welcome {userDetails.name}</h1>
                <button onClick={logout}>Logout</button>
                <nav>
                        <NavLink to="./info"
                                style={({ isActive }) => isActive ? { backgroundColor: "rgb(224, 214, 239)" } : {}}>
                                Info</NavLink>
                        <NavLink to="./todos"
                                style={({ isActive }) => isActive ? { backgroundColor: "rgb(224, 214, 239)" } : {}}>
                                Todos</NavLink>
                        <NavLink to="./posts"
                                style={({ isActive }) => isActive ? { backgroundColor: "rgb(224, 214, 239)" } : {}}>
                                Posts</NavLink>
                        <NavLink to="./albums"
                                style={({ isActive }) => isActive ? { backgroundColor: "rgb(224, 214, 239)" } : {}}>
                                Albums</NavLink>
                </nav>
                <Outlet />
        </>);
}

export default Home;