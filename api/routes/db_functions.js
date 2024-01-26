import mongoose from "mongoose";

async function connectToDatabase() {
    mongoose.connect('mongodb://localhost:27017/football-matches');
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', () => {
        console.log('Connected to football-matches DB');
    });
}

function terminateConnection() {
    mongoose.connection.close();
}

export { connectToDatabase, terminateConnection }