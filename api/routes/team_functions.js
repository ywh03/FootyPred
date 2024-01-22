import mongoose from 'mongoose';

const teamSchema = new mongoose.Schema({
    _id: String, //Name of team
    fotmobUrl: String,
    logo: String, //logo url
    matchIds: {
        type: [String],
        unique: true,
    }
});

const Team = mongoose.model("Team", teamSchema);

async function addTeam(teamName, fotmobUrl) {
    const team = new Team({
        _id: teamName,
        fotmobUrl: fotmobUrl,
    })
    await team.save()
        .then(() => console.log("Team saved successfully"))
        .catch((err) => console.log("Error saving team: " + err));
}

async function removeTeam(teamName) {
    const query = {
        _id: teamName,
    }
    Team.findOneAndDelete(query);
}

async function showAllTeams() {
    const allTeams = await Team.find({});
    return allTeams;
}

export {addTeam, removeTeam, showAllTeams};