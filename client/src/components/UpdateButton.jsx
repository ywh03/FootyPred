import React from "react";
import axios from "axios";

export default function UpdateButton() {

    const [isUpdating, setUpdating] = React.useState(false);

    async function updateNextMatches() {
        setUpdating(true);
        const nextMatches = await axios.get('http://localhost:9000/scrape/nextMatches');
        console.log("Next matches found; adding next");
        console.log(nextMatches.data);
        await axios.post('http://localhost:9000/matches/checkMatchesAndAdd', {matches: nextMatches.data});
        setUpdating(false);
    }

    return (
        <button onClick={updateNextMatches}>{isUpdating ? "Updating" : "Update"}</button>
    )
}