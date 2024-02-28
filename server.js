const express = require('express')
const mysql = require('mysql2')
const { errorHandler } = require('./middlewares/errorMiddleware')
const moment = require('moment')
const cors = require('cors')
const dotenv = require('dotenv')

const app = express()
dotenv.config()
const PORT = process.env.PORT || 8080;

//connect to DB
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

db.connect((err) => {
    if (err) throw err
    console.log('Connected to mysql database')
})

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(errorHandler)
app.use(cors({ origin: true, credentials: true }))

//some wuick fix to prevent from disconnection
setInterval(() => {
    db.query('select 1')
}, 120000)


app.get("/", (req, res) => {
    res.json({ message: "API is Running!" })
})

// Display current week leaderboard (Top 200)
app.get('/leaderboard/current-week', (req, res) => {
    const startOfWeek = moment().startOf('week').format('YYYY-MM-DD HH:mm:ss');
    const endOfWeek = moment().endOf('week').format('YYYY-MM-DD HH:mm:ss');

    const query = `
      SELECT *
      FROM game_score
      WHERE TimeStamp BETWEEN '${startOfWeek}' AND '${endOfWeek}'
      ORDER BY Score DESC
      LIMIT 200;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching current week leaderboard:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.json(results);
    });
});

// Display last week leaderboard given a country by the user (Top 200)
app.get('/leaderboard/last-week/:country', (req, res) => {
    const country = req.params.country;
    const startOfLastWeek = moment().subtract(1, 'weeks').startOf('week').format('YYYY-MM-DD HH:mm:ss');
    const endOfLastWeek = moment().subtract(1, 'weeks').endOf('week').format('YYYY-MM-DD HH:mm:ss');

    const query = `
      SELECT *
      FROM game_score
      WHERE TimeStamp BETWEEN '${startOfLastWeek}' AND '${endOfLastWeek}'
      AND Country = '${country}'
      ORDER BY Score DESC
      LIMIT 200;
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching last week leaderboard:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        res.json(results);
    });
});

// Fetch user rank, given the userId
app.get('/leaderboard/user-rank/:userId', (req, res) => {
    const userId = req.params.userId;

    const query = `
      SELECT UID, Name, Score, Country, TimeStamp, 
      (
        SELECT COUNT(DISTINCT Score) + 1
        FROM game_score AS gs2
        WHERE gs2.Score > gs1.Score
      ) AS UserRank
      FROM game_score AS gs1
      WHERE UID = '${userId}';
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching user rank:', err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json(results);
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})