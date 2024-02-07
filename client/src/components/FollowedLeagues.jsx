import React from "react";
import axios from "axios";
import NavBar from "./NavBar.jsx";
import League from "./League.jsx";

export default function FollowedLeagues () {

    const [allLeagues, setAllLeagues] = React.useState();
    const [isLeaguesLoading, setLeaguesLoading] = React.useState(true);

    async function getAllLeagues() {
        const response = await axios.get('http://localhost:9000/leagues');
        if (response.data.statusCode === 500) {
            console.log("Server error in getting all leagues");
            return;
        }
        setAllLeagues(response.data.leagues);
        setLeaguesLoading(false);
    }

    async function toggleLeague(index, newStatus) {
        setAllLeagues((prevArray) => {
            let tempLeagues = [...prevArray];
            const object = tempLeagues[index];
            object.followStatus = newStatus;
            tempLeagues[index] = object;
            return tempLeagues;
        })
        return;
    }

    React.useEffect(() => {
        getAllLeagues();
    }, [])

    return (
        <div>
            <NavBar />
            <h1 className="page-title">Leagues</h1>
            {
                isLeaguesLoading ? (
                    <p>Leagues Loading...</p>
                ) : (
                    <div>
                        <div className="league-columns">
                            <div className="league-column league-column-active">
                                <h2 className="league-column-title">Active Leagues</h2>
                                <div className="league-table">
                                    <div className="league-row league-table-headers">
                                        <p className="league-row-item league-row-remove-button">Remove</p>
                                        <p className="league-row-item league-row-alias">League</p>
                                        <p className="league-row-item league-row-status">Status</p>
                                        <p className="league-row-item league-row-toggle-button">Toggle Default</p>
                                    </div>
                                    {
                                        allLeagues.map(function(league, index) {
                                            return (
                                                league.followStatus === "no-scrape" ? null : (
                                                    <League leagueDetails={league} setAllLeagues={setAllLeagues} index={index} toggleLeague={toggleLeague} />
                                                )
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className="league-column league-column-available">
                                <h2 className="league-column-title">Available Leagues</h2>
                                <div className="league-table">
                                    <div className="league-row league-table-headers">
                                        <p className="league-row-item league-row-remove-button">Add</p>
                                        <p className="league-row-item league-row-alias">League</p>
                                        <p className="league-row-item league-row-status">Status</p>
                                    </div>
                                    {
                                        allLeagues.map(function(league, index) {
                                            return (
                                                league.followStatus === "no-scrape" ? (
                                                    <League leagueDetails={league} setAllLeagues={setAllLeagues} index={index} toggleLeague={toggleLeague} />
                                                ) : null
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}