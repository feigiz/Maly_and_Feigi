import React from "react";
import { Link } from 'react-router-dom';

function Application() {
    return (<>
        <Link to="/login">log in</Link>
        <br />
        <Link to="/signup">sign up</Link>
    </>);
}

export default Application;