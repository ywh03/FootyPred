import React from "react";
import axios from "axios";

export default function MatchPopup(props) {

    function submitPredScores(event) {
        //TODO: Stop page refresh and handle react updates after form submission
        const submittedPred = {
            "matchId": props.matchId,
            "predHomeScore": event.target.predHomeScore.value,
            "predAwayScore" : event.target.predAwayScore.value,
        }
        axios.post('http://localhost:9000/matches/updatepred', submittedPred);
    }

    return (
        <div className="prediction-form">
            <form onSubmit={submitPredScores}>
                <div className="form-row">
                    <input className="prediction-form-field form-control-inline" type="number" name="predHomeScore" min="0" placeholder={props.homeTeam} />
                    <span> : </span>
                    <input className="prediction-form-field form-control-inline" type="number" name="predAwayScore" min="0" placeholder={props.awayTeam} />
                    <button className="prediction-button btn btn-success" type="submit">Submit</button>
                </div>
            </form>
        </div>
    )
}