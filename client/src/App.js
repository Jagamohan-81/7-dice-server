import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Typography, Select, MenuItem, Grid, Box } from '@mui/material';
import { styled, keyframes } from '@mui/material/styles';

const Root = styled(Container)(({ theme }) => ({
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
    },
}));

const Title = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(2),
}));

const Points = styled(Box)(({ theme }) => ({
    textAlign: 'center',
    marginBottom: theme.spacing(2),
}));

const DiceResults = styled(Box)(({ theme }) => ({
    marginTop: theme.spacing(4),
    textAlign: 'center',
}));

const winAnimation = keyframes`
    0%, 100% {
        background-color: #4caf50;
    }
    50% {
        background-color: #81c784;
    }
`;

const loseAnimation = keyframes`
    0%, 100% {
        background-color: #f44336;
    }
    50% {
        background-color: #e57373;
    }
`;

const ResultMessage = styled(Box)(({ theme, win }) => ({
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    color: theme.palette.common.white,
    animation: `${win ? winAnimation : loseAnimation} 6s ease-in-out`,
}));

const App = () => {
    const [points, setPoints] = useState(5000);
    const [betAmount, setBetAmount] = useState(100);
    const [betOption, setBetOption] = useState('7 Up');
    const [dice1, setDice1] = useState(null);
    const [dice2, setDice2] = useState(null);
    const [result, setResult] = useState('');
    const [winAmount, setWinAmount] = useState(0);

    useEffect(() => {
        const fetchPoints = async () => {
            const response = await axios.get('/api/points', {
                withCredentials: true
            });
            setPoints(response.data.points);
        };
        fetchPoints();
    }, []);

    const handleBet = async () => {
        const response = await axios.post('/api/bet', {
            betAmount,
            betOption
        });

        setDice1(response.data.dice1);
        setDice2(response.data.dice2);
        setResult(response.data.result);
        setWinAmount(response.data.winAmount);
        setPoints(response.data.userPoints);
    };

    return (
        <Root>
            <Title>
                <Typography variant="h4" gutterBottom>7 Up 7 Down Game</Typography>
            </Title>
            <Points>
                <Typography variant="h6">Points: {points}</Typography>
            </Points>

            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} sm={6} md={4}>
                    <Select
                        fullWidth
                        value={betAmount}
                        onChange={(e) => setBetAmount(e.target.value)}
                    >
                        <MenuItem value={100}>100</MenuItem>
                        <MenuItem value={200}>200</MenuItem>
                        <MenuItem value={500}>500</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <Select
                        fullWidth
                        value={betOption}
                        onChange={(e) => setBetOption(e.target.value)}
                    >
                        <MenuItem value="7 Up">7 Up</MenuItem>
                        <MenuItem value="7 Down">7 Down</MenuItem>
                        <MenuItem value="7">7</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12} sm={12} md={4}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={handleBet}
                    >
                        Roll Dice
                    </Button>
                </Grid>
            </Grid>

            {dice1 !== null && dice2 !== null && (
                <DiceResults>
                    <Typography variant="h6">Dice Results: {dice1}, {dice2}</Typography>
                    <Typography variant="h6">Result: {result}</Typography>
                    <ResultMessage win={winAmount > 0}>
                        <Typography variant="h6">
                            You {winAmount > 0 ? 'won' : 'lost'}: {Math.abs(winAmount)}
                        </Typography>
                    </ResultMessage>
                </DiceResults>
            )}
        </Root>
    );
};

export default App;
