import React, { useEffect } from "react";
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

function Header() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate("./login")
    }, [])
    
    return (<>
        <nav className="navLogin">
            <NavLink to="/login"
                style={({ isActive }) => isActive ? { backgroundColor: "rgb(224, 214, 239)" } : {}}>
                log in</NavLink>
            <NavLink to="/signup"
                style={({ isActive }) => isActive ? { backgroundColor: "rgb(224, 214, 239)" } : {}}>
                sign up</NavLink>
        </nav>
        <Outlet />
    </>);
}

export default Header;