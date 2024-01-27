import React from "react";
import axios from "axios";
import NavBar from "./NavBar.jsx";
import StatsDisplay from "./StatsDisplay.jsx";

export default function Stats() {

    React.useEffect(() => {
        //getPastMatches();
    }, [])

    return (
        <div>
            <NavBar />
            <h1>Statistics</h1>
            <StatsDisplay />
        </div>
    )
}