import React from "react";
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    const currentUser = JSON.parse(localStorage.getItem('currentUser'))
    if (currentUser != null)
        navigate(`/home/${currentUser.name}`);
    return (<>
        <nav>
            <NavLink to="/login" style={({ isActive }) => isActive ? { color: 'red' } : {}}>log in</NavLink>
            <NavLink to="/signup" style={({ isActive }) => isActive ? { color: 'red' } : {}}>sign up</NavLink>
        </nav>
        <Outlet />
    </>);
}

export default Header;