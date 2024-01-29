import React from "react";
import axios from "axios";

export default function MatchPopup(props) {

    function submitPredScores(event) {
        const submittedPred = {
            "matchId": props.matchId,
            "predHomeScore": event.target.predHomeScore.value,
            "predAwayScore" : event.target.predAwayScore.value,
        }
        axios.post('http://localhost:9000/matches/updatepred', submittedPred);
    }

    return (
        <div className="submit-pred-form">
            <form onSubmit={submitPredScores}>
                <label htmlFor="predHomeScore">{props.homeTeam}</label>
                <input type="number" name="predHomeScore" min="0" />
                <span> : </span>
                <label htmlFor="predAwayScore">{props.awayTeam}</label>
                <input type="number" name="predAwayScore" min="0" />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}