import { useState, useEffect } from "react";

export default function useNextId(id) {
    const [nextId, setNextId] = useState()

    useEffect(() => {
        fetch(`http://localhost:3000/nextIDs/${id}`)
            .then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();
            })
            .then(json =>
                setNextId(json.nextId)
            ).catch(ex => alert(ex))
    }, [])

    useEffect(() => {
        if (nextId != null)
            fetch(`http://localhost:3000/nextIDs/${id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    "nextId": nextId
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            }).then(response => {
                if (!response.ok)
                    throw 'Error' + response.status + ': ' + response.statusText;
                return response.json();
            }).catch(ex => alert(ex))
    }, [nextId])

    return [nextId, setNextId]
}