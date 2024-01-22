const oddsportalLeaguesUrlsMap = {
    "premier-league": 'https://www.oddsportal.com/soccer/england/premier-league',
    "ligue-1": 'https://www.oddsportal.com/soccer/france/ligue-1',
    "bundesliga": 'https://www.oddsportal.com/soccer/germany/bundesliga',
    "championship": 'https://www.oddsportal.com/football/england/championship',
    "laliga": 'https://www.oddsportal.com/football/spain/laliga',
    "serie-a": 'https://www.oddsportal.com/football/italy/serie-a',
    "champions-league": "https://www.oddsportal.com/football/europe/champions-league/",
    "europa-league": "https://www.oddsportal.com/football/europe/europa-league/",
    "europa-conference-league": "https://www.oddsportal.com/football/europe/europa-conference-league/",
    "euro": "https://www.oddsportal.com/football/europe/euro-2024/",
    "fa-cup": "https://www.oddsportal.com/football/england/fa-cup/",
    "efl-cup": "https://www.oddsportal.com/football/england/efl-cup/",
    "dfb-pokal": "https://www.oddsportal.com/football/germany/dfb-pokal/",
    "coppa-italia": "https://www.oddsportal.com/football/italy/coppa-italia/",
    "copa-del-rey": "https://www.oddsportal.com/football/spain/copa-del-rey/"
}

const fotmobLeaguesUrlsMap = {
    "premier-league": "https://www.fotmob.com/leagues/47/matches/premier-league",
    "champions-league": "https://www.fotmob.com/leagues/42/matches/champions-league",
    "laliga": "https://www.fotmob.com/leagues/87/matches/laliga",
    "bundesliga": "https://www.fotmob.com/leagues/54/matches/bundesliga",
    "fifa-world-cup": "https://www.fotmob.com/leagues/77/matches/world-cup",
    "europa-league": "https://www.fotmob.com/leagues/73/matches/europa-league",
    "serie-a": "https://www.fotmob.com/leagues/55/matches/serie",
    "liga-1": "https://www.fotmob.com/leagues/53/matches/ligue-1",
    "fa-cup": "https://www.fotmob.com/leagues/132/matches/fa-cup",
    "efl-cup": "https://www.fotmob.com/leagues/133/matches/efl-cup",
    "europa-conference-league": "https://www.fotmob.com/leagues/10216/matches/europa-conference-league",
    "dfb-pokal": "https://www.fotmob.com/leagues/209/matches/dfb-pokal",
    "coppa-italia": "https://www.fotmob.com/leagues/141/matches/coppa-italia",
    "copa-del-rey": "https://www.fotmob.com/leagues/138/matches/copa-del-rey"
}

const followedTeams = [
    "Liverpool"
]

//TODO: IMPLEMENT A REMAP TEAM NAME FUNCTION
const remappedTeamNames = {
    "Nottingham": "Nottingham Forest",
    "Luton": "Luton Town",
    "Newcastle": "Newcastle Utd",
    "Ath Bilbao": "Athletic Bilbao",
    "Betis": "Real Betis",
    "Atl. Madrid": "Atlético de Madrid",
    "Stuttgart": "VfB Stuttgart",
    "Bochum": "VfL Bochum",
    "Dortmund": "Borussia Dortmund",
    "Wolfsburg": "VfL Wolfsburg"
}

export { oddsportalLeaguesUrlsMap, fotmobLeaguesUrlsMap, followedTeams, remappedTeamNames}