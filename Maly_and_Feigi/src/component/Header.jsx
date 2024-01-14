import React from "react";
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function Header() {
   
    return (<>
        <nav>
            <NavLink to="/login" style={({ isActive }) => isActive ? { border: "1px solid black", borderRadius: "10px", padding: "10px" } : {}}>log in</NavLink>
            <br />
            <br />
            <NavLink to="/signup" style={({ isActive }) => isActive ? { border: "1px solid black", borderRadius: "10px", padding: "10px" } : {}}>sign up</NavLink>
        </nav>
        <Outlet />
    </>);
}

export default Header;