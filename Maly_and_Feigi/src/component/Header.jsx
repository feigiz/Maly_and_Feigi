import React from "react";
import { NavLink, Outlet } from 'react-router-dom';

function Header() {

    return (<>
        <nav class="navLogin">
            <NavLink to="/login"
                style={({ isActive }) => isActive ? {   backgroundColor: "rgb(224, 214, 239)" } : {}}>
                log in</NavLink>
            <NavLink to="/signup"
                style={({ isActive }) => isActive ? {   backgroundColor: "rgb(224, 214, 239)" } : {}}>
                sign up</NavLink>
        </nav>
        <Outlet />
    </>);
}

export default Header;