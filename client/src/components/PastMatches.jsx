import React from "react";
import axios from "axios";
import NavBar from "./NavBar.jsx";
import MatchDisplay from "./MatchDisplay.jsx";

export default function PastMatches() {

    const [isLoading, setLoading] = React.useState(true);
    const [pastMatches, setPastMatches] = React.useState();

    async function getPastMatches() {
        const rawPastMatches = await axios.get('http://localhost:9000/matches/pastmatches');
        setPastMatches(rawPastMatches.data);
        setLoading(false);
    }

    React.useEffect(() => {
        getPastMatches();
    }, [])

    return (
        <div>
            <NavBar />
            <h1>Past Matches</h1>
            {
                isLoading ? (
                    <h2>Matches Loading...</h2>
                ) : (
                    <MatchDisplay isPast={true} matches={pastMatches} setMatches={setPastMatches} />
                )
            }
        </div>
    )
}