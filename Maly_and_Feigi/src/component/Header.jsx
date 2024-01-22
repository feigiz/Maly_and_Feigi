import React from "react";
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function Header() {

    return (<>
        <nav>
            <NavLink to="/login"
                style={({ isActive }) => isActive ? {   backgroundColor: "rgb(224, 214, 239)" } : {}}>
                log in</NavLink>
            <NavLink to="/signup"
                style={({ isActive }) => isActive ? {   backgroundColor: "rgb(224, 214, 239)" } : {}}>
                sign up</NavLink>
        </nav>
        {/* <nav>
            <NavLink to="/login"> log in</NavLink>
            <NavLink to="/signup"> sign up</NavLink>
        </nav> */}
        <Outlet />
    </>);
}

export default Header;