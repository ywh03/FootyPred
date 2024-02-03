import React from "react";
import NavBar from "./NavBar.jsx";
import StatsDisplay from "./StatsDisplay.jsx";

export default function Stats() {

    React.useEffect(() => {
        //getPastMatches();
    }, [])

    return (
        <div>
            <NavBar />
            <h1 className="page-title">Statistics</h1>
            <StatsDisplay />
        </div>
    )
}