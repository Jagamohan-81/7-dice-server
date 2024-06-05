const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors({
    origin: function(origin, callback) {
        console.log("origin=",origin)
        const allowedOrigins = ['http://localhost:3000', 'https://7-dice-by-jagamohan.vercel.app/'];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true); 
        } else {
            callback(new Error('Not allowed by CORS')); 

        }
    }
}));
app.use(bodyParser.json());

let userPoints = 5000;

// Function to roll dice
const rollDice = () => Math.floor(Math.random() * 6) + 1;

// POST endpoint to place a bet and roll dice
app.post('/bet', (req, res) => {
    const { betAmount, betOption } = req.body;

    if (betAmount > userPoints) {
        return res.status(400).json({ error: 'Insufficient points' });
    }

    const dice1 = rollDice();
    const dice2 = rollDice();
    const sum = dice1 + dice2;

    let result = '';
    let winAmount = 0;

    if (sum < 7) {
        result = '7 Down';
        if (betOption === '7 Down') {
            winAmount = betAmount * 2;
        }
    } else if (sum > 7) {
        result = '7 Up';
        if (betOption === '7 Up') {
            winAmount = betAmount * 2;
        }
    } else {
        result = '7';
        if (betOption === '7') {
            winAmount = betAmount * 5;
        }
    }

    userPoints += winAmount - betAmount;

    res.json({
        dice1,
        dice2,
        sum,
        result,
        winAmount,
        userPoints
    });
});

// GET endpoint to get user points
app.get('/points', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.json({ points: userPoints });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;