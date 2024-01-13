import React from "react";
import { Link } from 'react-router-dom';

function Application() {
    //להפוך ל NAVLINK 
    //כדי לעשות עיצוב ל ISACTIVE
    //Active Link Styling with NavLink in scrimba
    return (<>
        <Link to="/login">log in</Link>
        <br />
        <Link to="/signup">sign up</Link>
    </>);
}

export default Application;