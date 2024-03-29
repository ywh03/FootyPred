import React from "react";
import MatchPopup from "./MatchPopup";
import { convertLeagueNameToFull } from "./GeneralUtilities.js";

export default function Match(props) {

    const [popupOpen, setPopupOpen] = React.useState(false);

    function convertISOtoLocalDate(isoDate) {
        const utcDate = new Date(isoDate);
        const localDate = utcDate.toLocaleString();
        return localDate;
    }

    function togglePopup() {
        if (props.isPast) return;
        setPopupOpen(!popupOpen);
    }

    async function delMatch(event) {
        const matchId = props.matchDetails._id;
        event.stopPropagation();
        await props.removeMatch(matchId, props.index);
    }

    return (
        <div>
            {
                props.isMatchUpdating ? (
                    <div className="match-row">
                        <p><b>Updating Match Scores...</b></p>
                    </div>
                ) : (
                    <div key={props.matchDetails._id} className="match-row" onClick={togglePopup}>
                        {
                            props.isPast ? null : (
                                <div className="match-row-item match-row-remove-button">
                                    {
                                        props.isPast ? null : (<button className="remove-button btn btn-danger" onClick={delMatch}> {props.wantHidden ? "+" : "-"} </button>)
                                    }
                                </div>
                            )
                        }
                        {
                            props.matchDetails.matchStatus !== "Completed" && props.matchDetails.matchStatus !== "Uncommenced" ? (
                                <p className="match-ongoing match-row-item match-row-date">{props.matchDetails.matchStatus}</p> 
                                ) : (
                                <p className="match-row-item match-row-date">{convertISOtoLocalDate(props.matchDetails.date)}</p>
                            )
                        }
                        <p className="match-row-item match-row-competition">{convertLeagueNameToFull(props.matchDetails.leagueName)}</p>
                        <p className="match-row-item match-row-match">{props.matchDetails.homeTeam}<b>
                            {
                                props.isMatchUpdating === true ?
                                //TODO: Make this a small animated spinner
                                <span> ? - ? </span> :
                                null
                            }
                            { props.matchDetails.hasOwnProperty('actlHomeScore') ?
                                <span className={props.matchDetails.matchStatus !== "Uncommenced" && props.matchDetails.matchStatus !== "Completed" ? "match-ongoing" : ""}> {props.matchDetails.actlHomeScore} - {props.matchDetails.actlAwayScore} </span> :
                                props.isMatchUpdating === true ?
                                null : <span> - </span>
                            }
                        </b>{props.matchDetails.awayTeam}</p>
                        <p className={`match-row-item match-row-prediction ${
                            props.matchDetails.actlHomeScore === undefined ? null : props.matchDetails.actlHomeScore === props.matchDetails.predHomeScore && props.matchDetails.actlAwayScore === props.matchDetails.predAwayScore ? "correct-prediction" : "incorrect-prediction"
                        }`} >{props.matchDetails.predHomeScore} - {props.matchDetails.predAwayScore}</p>
                        <p className={`match-row-item match-row-odd ${ props.matchDetails.hasOwnProperty('actlHomeScore') && props.matchDetails.hasOwnProperty('predHomeScore') && props.matchDetails.actlHomeScore > props.matchDetails.actlAwayScore && props.matchDetails.predHomeScore > props.matchDetails.predAwayScore ? "correct-prediction" : props.matchDetails.hasOwnProperty('actlHomeScore') && props.matchDetails.hasOwnProperty('predHomeScore') && props.matchDetails.predHomeScore > props.matchDetails.predAwayScore ? "incorrect-prediction" : null }`}>{props.matchDetails.homeProb.toFixed(2)}</p>
                        <p className={`match-row-item match-row-odd ${ props.matchDetails.hasOwnProperty('actlHomeScore') && props.matchDetails.hasOwnProperty('predHomeScore') && props.matchDetails.actlHomeScore === props.matchDetails.actlAwayScore && props.matchDetails.predHomeScore === props.matchDetails.predAwayScore ? "correct-prediction" : props.matchDetails.hasOwnProperty('actlHomeScore') && props.matchDetails.hasOwnProperty('predHomeScore') && props.matchDetails.predHomeScore === props.matchDetails.predAwayScore ? "incorrect-prediction" : null }`}>{props.matchDetails.drawProb.toFixed(2)}</p>
                        <p className={`match-row-item match-row-odd ${ props.matchDetails.hasOwnProperty('actlHomeScore') && props.matchDetails.hasOwnProperty('predHomeScore') && props.matchDetails.actlHomeScore < props.matchDetails.actlAwayScore && props.matchDetails.predHomeScore < props.matchDetails.predAwayScore ? "correct-prediction" : props.matchDetails.hasOwnProperty('actlHomeScore') && props.matchDetails.hasOwnProperty('predHomeScore') && props.matchDetails.predHomeScore < props.matchDetails.predAwayScore ? "incorrect-prediction" : null }`}>{props.matchDetails.awayProb.toFixed(2)}</p>
                    </div> 
                )
            }
            <div>
                {
                    popupOpen ? (
                        <MatchPopup matchId={props.matchDetails._id} homeTeam={props.matchDetails.homeTeam} awayTeam={props.matchDetails.awayTeam} setMatches={props.setMatches} togglePopup={togglePopup} index={props.index} />
                    ) : null
                }
            </div>
        </div>
    )
}