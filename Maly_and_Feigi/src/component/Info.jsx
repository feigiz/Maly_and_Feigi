import React from "react";
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';

function Info() {
    const userDetailes = useLocation();
    console.log(userDetailes.state)
    return (<>
        <h1>information</h1>
        <p><b>name:</b> {userDetailes.state.name}</p>

        {/* לכתוב את כל הפרטים */}
    </>);
}

export default Info;