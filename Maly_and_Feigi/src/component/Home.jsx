import React from "react";
import { Link, Outlet, useNavigate } from 'react-router-dom';
function Home() {
    const userDetailes = JSON.parse(localStorage.getItem('currentUser'));

    const navigate = useNavigate();

    function logout() {
        localStorage.clear()
        navigate("/")
    }
    
    return (<>
        <h1>welcome {userDetailes.name}</h1>
        <Link to="./info" state={userDetailes}>Info</Link>
        <Link to="./todos" state={userDetailes}>Todos</Link>
        <Link to="./posts">Posts</Link>
        <Link to="./albums">Albums</Link>
        <button onClick={logout}>Logout</button>
        <Outlet />
        {/* <Link to="/"></Link> */}
    </>);
}

export default Home;