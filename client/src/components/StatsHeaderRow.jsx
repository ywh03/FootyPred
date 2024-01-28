import React from "react";

export default function StatsHeaderRow(props) {
    return (
        <div>
            {
                props.type === "overall" ? (
                    <div className="stats-row-overall">
                        <p>Correct 1X2 Predictions</p>
                        <p>Wrong 1X2 Predictions</p>
                        <p>Exact Score Predictions</p>
                        <p>Total Gain</p>
                        <p>Net Gain</p>
                        <p>Total Score</p>
                    </div>
                ) : (
                    <div className="stats-row">
                        {
                            props.type === "league" ? (
                                <p>League</p>
                            ) : (
                                <p>Team</p>
                            )
                        }
                        <p>Correct 1X2 Predictions</p>
                        <p>Wrong 1X2 Predictions</p>
                        <p>Exact Score Predictions</p>
                        <p>Total Gain</p>
                        <p>Net Gain</p>
                        <p>Total Score</p>
                    </div>
                )
            }
        </div>
    )
}