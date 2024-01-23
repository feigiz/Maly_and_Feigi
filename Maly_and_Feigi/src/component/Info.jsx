import React, { useContext } from "react";
import { AppContext } from "../App";

function Info() {
    const { userDetails } = useContext(AppContext)

    const print = (myObject) => {
        return Object.keys(myObject).map((key) => (typeof myObject[key] === 'object' ?
            <div key={key} >
                <br />
                <h3><ins>{key + ":"}</ins></h3>
                {print(myObject[key])}
            </div>
            :
            <p key={key}><b>{key}:</b> {myObject[key]}</p>
        ))
    }

    return (<>
        <br /><br />
        <div>
            {print(userDetails)}
        </div>
    </>);
}

export default Info;