import express from 'express';
import { connectToDatabase, terminateConnection } from './routes/db_functions.js';
import cors from 'cors';
import bodyParser from 'body-parser';

import indexRouter from './routes/index.js';
import matchRouter from './routes/match_functions.js';
import scrapeRouter from './routes/oddsportal_scrapers.js';
import statsRouter from './routes/stats_handler.js'

const app = express();

connectToDatabase();

app.use(cors({origin:true}));
app.use(express.json());

app.use(('/', indexRouter));
app.use('/matches', matchRouter);
app.use('/scrape', scrapeRouter);
app.use('/stats', statsRouter);
app.listen(9000, function(){
	console.log("Server started on port 9000");
});