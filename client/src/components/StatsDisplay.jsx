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
                    <h2 className="stats-loading-prompt">Stats Loading...</h2>
                ) : (
                    <div>
                        <div className="stats-table">
                            <h2>Overall Stats</h2>
                            <StatsHeaderRow type="overall" />
                            <div className="stats-row stats-row-grey">
                                <p className="stats-row-correct-pred">{stats.overallStats.correctWins}</p>
                                <p className="stats-row-wrong-pred">{stats.overallStats.wrongWins}</p>
                                <p className="stats-row-exact-pred">{stats.overallStats.correctScores}</p>
                                <p className="stats-row-total-gain">{stats.overallStats.totalGain.toFixed(2)}</p>
                                <p className="stats-row-net-gain">{stats.overallStats.netGain.toFixed(2)}</p>
                                <p className="stats-row-total-score">{(parseFloat(stats.overallStats.netGain) + parseFloat(stats.overallStats.correctScores)).toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="stats-table">
                            <h2>Competition Stats</h2>
                            <StatsHeaderRow type="league" />
                            {
                                Object.keys(stats.leagueStats).map(function(league, index) {
                                    return (
                                        <div className={"stats-row " + (index % 2 === 0 ? "stats-row-grey" : "stats-row-white")}>
                                            <p className="stats-row-type">{convertLeagueNameToFull(league)}</p>
                                            <p className="stats-row-correct-pred">{stats.leagueStats[league].correctWins}</p>
                                            <p className="stats-row-wrong-pred">{stats.leagueStats[league].wrongWins}</p>
                                            <p className="stats-row-exact-pred">{stats.leagueStats[league].correctScores}</p>
                                            <p className="stats-row-total-gain">{stats.leagueStats[league].totalGain.toFixed(2)}</p>
                                            <p className="stats-row-net-gain">{stats.leagueStats[league].netGain.toFixed(2)}</p>
                                            <p className="stats-row-total-score">{(parseFloat(stats.leagueStats[league].netGain) + parseFloat(stats.leagueStats[league].correctScores)).toFixed(2)}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div className="stats-table">
                            <h2>Team Stats</h2>
                            <StatsHeaderRow type="team" />
                            {
                                Object.keys(stats.teamStats).map(function(team, index) {
                                    return (
                                        <div className={"stats-row " + (index % 2 === 0 ? "stats-row-grey" : "stats-row-white")}>
                                            <p className="stats-row-type">{team}</p>
                                            <p className="stats-row-correct-pred">{stats.teamStats[team].correctWins}</p>
                                            <p className="stats-row-wrong-pred">{stats.teamStats[team].wrongWins}</p>
                                            <p className="stats-row-exact-pred">{stats.teamStats[team].correctScores}</p>
                                            <p className="stats-row-total-gain">{stats.teamStats[team].totalGain.toFixed(2)}</p>
                                            <p className="stats-row-net-gain">{stats.teamStats[team].netGain.toFixed(2)}</p>
                                            <p className="stats-row-total-score">{(parseFloat(stats.teamStats[team].netGain) + parseFloat(stats.teamStats[team].correctScores)).toFixed(2)}</p>
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