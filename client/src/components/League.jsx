import React from 'react';
import axios from 'axios';

export default function League(props) {

    async function toggleLeagueStatus (event) {
        const leagueId = props.leagueDetails._id;
        event.stopPropagation();
        const currentStatus = props.leagueDetails.followStatus;
        const newStatus = currentStatus === "no-scrape" ? "default-out" : "no-scrape";
        const response = await axios.post("http://localhost:9000/leagues/updateStatus", {leagueId: leagueId, newStatus: newStatus});
        console.log(response);
        if (response.data.responseCode === 201) {
            props.toggleLeague(props.index, newStatus);
            console.log("Successfully updated league status");
        }
        else if (response.data.responseCode === 500) console.log("Failed to update league status");
    }

    async function toggleDefault (event) {
        const leagueId = props.leagueDetails._id;
        event.stopPropagation();
        const currentStatus = props.leagueDetails.followStatus;
        const newStatus = currentStatus === "default-in" ? "default-out" : "default-in";
        const response = await axios.post("http://localhost:9000/leagues/updateStatus", {leagueId: leagueId, newStatus: newStatus});
        console.log(response);
        if (response.data.responseCode === 201) {
            props.toggleLeague(props.index, newStatus);
            console.log("Successfully updated league status");
        }
        else if (response.data.responseCode === 500) console.log("Failed to update league status");
    }

    return (
        <div className="league-row">
            <div className="league-row-item league-row-remove-button">
            {
                props.leagueDetails.followStatus === "no-scrape" ? (
                    <button className="add-button btn btn-success" onClick={toggleLeagueStatus}>+</button>
                ) : ( 
                    <button className="remove-button btn btn-danger" onClick={toggleLeagueStatus}>-</button>
                )
            }
            </div>
            <p className="league-row-item league-row-alias">{props.leagueDetails.alias}</p>
            <p className="league-row-item league-row-status">{props.leagueDetails.followStatus}</p>
            {
                props.leagueDetails.followStatus === "no-scrape" ? null : (
                    <div className="league-row-item league-row-toggle-button">
                        <button className="toggle-button btn btn-secondary" onClick={toggleDefault}>Toggle</button>
                    </div>
                )
            }
        </div>
    )
}