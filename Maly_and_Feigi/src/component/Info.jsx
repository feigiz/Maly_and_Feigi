import React, { useContext } from "react";
import { AppContext } from "../App";

function Info() {
    const { userDetails } = useContext(AppContext)

    const print = (detail) => {
        return Object.keys(detail).map((key) => (typeof detail[key] === 'object' ?
            <div key={key} >
                <br />
                <h3><ins>{key + ":"}</ins></h3>
                {print(detail[key])}
            </div>
            :
            <p key={key}><b>{key}:</b> {detail[key]}</p>
        ))
    }

    return (<>
        {print(userDetails)}
    </>);
}

export default Info;