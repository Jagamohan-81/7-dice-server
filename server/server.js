const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
let userPoints = 5000;

const rollDice = () => Math.floor(Math.random() * 6) + 1;

app.post('/api/bet', (req, res) => {
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

app.get('/api/points', (req, res) => {
    res.json({ points: userPoints });
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// The "catchall" handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

module.exports = app;
