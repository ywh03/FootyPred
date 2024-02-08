import React from "react";

export default function StatsHeaderRow(props) {
    return (
        <div className="stats-row stats-table-header">
            {
                props.type === "league" ? (
                    <p className="stats-row-type">League</p>
                ) : props.type === "team" ? (
                    <p className="stats-row-type">Team</p>
                ) : null
            }
            <p className="stats-row-correct-pred">Correct Predictions</p>
            <p className="stats-row-wrong-pred">Wrong Predictions</p>
            <p className="stats-row-exact-pred">Exact Predictions</p>
            <p className="stats-row-total-gain">Total Gain</p>
            <p className="stats-row-net-gain">Net Gain</p>
            <p className="stats-row-total-score">Total Score</p>
        </div>
    )
}