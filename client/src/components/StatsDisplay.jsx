import React from "react";
import axios from "axios";
import StatsHeaderRow from "./StatsHeaderRow.jsx";
import { convertLeagueNameToFull } from "./GeneralUtilities.js";

export default function StatsDisplay() {
    const [isLoading, setLoading] = React.useState(true);
    const [stats, setStats] = React.useState({});

    //TODO: Graph of gain over time

    async function getAllStats() {
        const rawAllStats = await axios.get("http://localhost:9000/stats");
        const allStats = rawAllStats.data;
        setStats(allStats);
        console.log(allStats);
        setLoading(false);
    }

    React.useEffect(() => {
        getAllStats();
    }, [])

    //TODO: Graphs perhaps?
    return (
        <div>
            {
                isLoading ? (
                    <h2>Stats Loading...</h2>
                ) : (
                    <div>
                        <div>
                            <h2>Overall Stats</h2>
                            <StatsHeaderRow type="overall" />
                            <div className="stats-row-overall">
                                <p>{stats.overallStats.correctWins}</p>
                                <p>{stats.overallStats.wrongWins}</p>
                                <p>{stats.overallStats.correctScores}</p>
                                <p>{stats.overallStats.totalGain}</p>
                                <p>{stats.overallStats.netGain.toFixed(2)}</p>
                                <p>{parseFloat(stats.overallStats.netGain.toFixed(2)) + parseFloat(stats.overallStats.correctScores.toFixed(2))}</p>
                            </div>
                        </div>
                        <div>
                            <h2>Competition Stats</h2>
                            <StatsHeaderRow type="league" />
                            {
                                Object.keys(stats.leagueStats).map(function(league) {
                                    return (
                                        <div className="stats-row">
                                            <p>{convertLeagueNameToFull(league)}</p>
                                            <p>{stats.leagueStats[league].correctWins}</p>
                                            <p>{stats.leagueStats[league].wrongWins}</p>
                                            <p>{stats.leagueStats[league].correctScores}</p>
                                            <p>{stats.leagueStats[league].totalGain}</p>
                                            <p>{stats.leagueStats[league].netGain.toFixed(2)}</p>
                                            <p>{parseFloat(stats.leagueStats[league].netGain.toFixed(2)) + parseFloat(stats.leagueStats[league].correctScores.toFixed(2))}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div>
                            <h2>Team Stats</h2>
                            <StatsHeaderRow type="team" />
                            {
                                Object.keys(stats.teamStats).map(function(team) {
                                    return (
                                        <div className="stats-row">
                                            <p>{team}</p>
                                            <p>{stats.teamStats[team].correctWins}</p>
                                            <p>{stats.teamStats[team].wrongWins}</p>
                                            <p>{stats.teamStats[team].correctScores}</p>
                                            <p>{stats.teamStats[team].totalGain}</p>
                                            <p>{stats.teamStats[team].netGain.toFixed(2)}</p>
                                            <p>{parseFloat(stats.teamStats[team].netGain.toFixed(2)) + parseFloat(stats.teamStats[team].correctScores.toFixed(2))}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    
                )
            }
        </div>
    )
}