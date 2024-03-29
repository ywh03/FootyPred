import React from "react";
import axios from "axios";
import NavBar from "./NavBar.jsx";
import UpdateButton from "./UpdateButton.jsx";
import MatchDisplay from "./MatchDisplay.jsx";

//TODO: Implement an importer from CSV
//TODO: Reload button on individual matches to check if they are ongoing / should I make it to search odds

export default function Home() {
    const [isLoading, setLoading] = React.useState(true);
    const [upcomingMatches, setUpcomingMatches] = React.useState();

    async function getUpcomingMatches() {
        const rawUpcomingMatches = await axios.get('http://localhost:9000/matches/upcomingmatches');
        setUpcomingMatches(rawUpcomingMatches.data);
        setLoading(false);
    }

    React.useEffect(() => {
        getUpcomingMatches();
    }, [])

    return (
        <div>
            <NavBar />
            <div className="top-bar-with-button">
                <h1 className="page-title">Upcoming Matches</h1>
                <UpdateButton pageMatchUpdate={getUpcomingMatches} />
            </div>
            {
                isLoading ? (
                    <h2 className="matches-loading-prompt">Matches Loading...</h2>
                ) : (
                    <MatchDisplay isPast={false} wantHidden={false} matches={upcomingMatches} setMatches={setUpcomingMatches} />
                )
            }
        </div>
    )
}