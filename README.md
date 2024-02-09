# FootyPred
##### A Football Result Guessing Game

## Pre-Requisites
#### JS
- This project is built using React.js, Express.js and Node.js
- Node.js version used for this project is v18.16.0
#### MongoDB
- To use this project, the mongodb server must be started
    - If MongoDB is installed via homebrew, run "brew services start mongodb/brew/mongodb-community"

## Getting Started
#### Launching the Application
- In the *api* directory, run "node app.js" (or "nodemon app.js" should you want to debug/make changes)
- In the *client* directory, run "npm start"
#### Configurations
- Upon launching the application, head to the *Additional Tools* tab
- Acquire the links for the leagues you want to follow from oddsportal e.g. "https://oddsportal.com/football/england/premier-league" and submit them through the "Manually Add Leagues" form on the page
- In the *Followed Leagues* tab, you can view the leagues that you have currently added
    - By default, added leagues are listed under "Available Leagues" column and have the "No Scrape" status i.e. they will not be scraped
    - To start scraping these leagues, press the "Add" button to add them to the "Active Leagues" column
    - Under the "Active Leagues" column, the default status is "Default Out", which means that scraped matches from these leagues are automatically under the *Deleted Matches* tab; these are for leagues which you don't usually follow and only occasionally want to predict a match for
    - Press the "Toggle" button to toggle the default status of these leagues; a status of "Default In" would mean that matches from these leagues are automatically added to the *Upcoming Matches* tab; these are for leagues which you actively follow and want to predict most of the matches for

## Tabs
#### Upcoming Matches
- These are the upcoming matches that have yet to commence / ongoing, as well as matches from the past two days (for easy reference)
- Ongoing matches have scores in red, as well as the match time displayed under the datetime column
- By clicking on a match, the user gets access to a form to submit the user-predicted scores for that match
- Press the "-" button to delete the match
- Pressing the "Update" button would scrape upcoming matches from all the leagues with a "Default In/Out" status; this process will take quite a while since it is done via webscraping multiple pages, and the current league that is being scraped will be displayed under the button
#### Past Matches
- These are completed matches that the user have predicted on
- Matches without user-predicted scores that have ended are automatically thrown to the *Deleted Matches* tab
#### Deleted Matches
- These are matches that are manually deleted or are part of a league with "Default Out" status when the match was scraped
- Press the "+" button to add the match back to upcoming matches
- Completed matches without user-predicted scores are automatically relegated here
#### Followed Leagues
- View and change the statuses of leagues
- Overview of Statuses:
    - Default In: Matches from these leagues are automatically added to the *Upcoming Matches* tab
    - Default Out: Matches from these leagues are automatically added to the *Deleted Matches* tab
    - No Scrape: Matches from these league are not scraped
#### Statistics
- View prediction statistics on all matches by overall, by league and by team
- 1 point is put into each match the user predicts on; based on 1X2 odds, each correct prediction (i.e. home win, draw or away win) is awarded its corresponding return, and each wrong prediction yields no return. This means that a wrong prediction would result in a net loss of one point, while a correct prediction with a 1.44 return would yield a net gain of 0.44 points.
- Exact score predictions yield 1 extra point
#### Additional Tools
- Use the manually add match option to add a one-off match to the database; this match will appear in the *Upcoming Matches* tab
- Use the manually add league option to add a league to the database, and visit the *Followed Leagues* tab to change its status