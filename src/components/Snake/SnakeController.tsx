import { useState, useEffect, useCallback } from "react";
import { Alert, Box, Fab, Paper, Slider, Snackbar } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';

import SnakeBoard from "./SnakeBoard";
import SnakeGame from "./SnakeGame";

function SnakeController() {
    const gridSize = 20;
    const minFrequencyMs = 10;
    const maxFrequencyMs = 300;
    const coolColor = "#870089";

    const [score, setScore] = useState(0);
    const [updateFrequencyMs, setUpdateFrequencyMs] = useState(300);
    const [game, setGame] = useState(new SnakeGame(gridSize));
    const [snakeCoords, setSnakeCoords] = useState(game.getSnakeCoords());
    const [foods, setFoods] = useState(game.getFoods());
    const [gameOver, setGameOver] = useState(false);

    const restartGame = () => {
        const newGame = new SnakeGame(gridSize);
        setGame(newGame);
        setScore(0);
        setGameOver(false);
        setSnakeCoords(game.getSnakeCoords());
        setFoods(game.getFoods());
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        switch (e.key) {
            case "ArrowUp":
                game.setDirection("up");
                break;
            case "ArrowDown":
                game.setDirection("down");
                break;
            case "ArrowLeft":
                game.setDirection("left");
                break;
            case "ArrowRight":
                game.setDirection("right");
                break;
            case "r":
                restartGame();
                break;
            default:
                break;
        }
    }, [game]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [game]);

    useEffect(() => {
        const interval = setInterval(() => {
            const reward = game.tick();
            setScore(prevScore => prevScore + reward);
            if (game.gameOver()) {
                setGameOver(true);
            }
            setSnakeCoords(game.getSnakeCoords());
            setFoods(game.getFoods());
        }, updateFrequencyMs);
        return () => {
            clearInterval(interval);
        };
    }, [game, updateFrequencyMs]);

    const board = SnakeBoard(snakeCoords, foods, gridSize);
    return <>
        <Snackbar
            open={gameOver}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={() => setGameOver(false)} severity="error" sx={{ width: '100%' }}>
                Game Over! Your score is {score}.
            </Alert>
        </Snackbar>
        <Paper elevation={15}>{board}</Paper>
        <Box component="section" color="secondary" sx={{ p: "10px" }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: "0px" }}>
                <Slider
                    aria-label="Speed"
                    value={maxFrequencyMs - updateFrequencyMs}
                    min={minFrequencyMs}
                    max={maxFrequencyMs}
                    color="secondary"
                    onChange={(e) => {
                        const target = e.target as HTMLInputElement;
                        setUpdateFrequencyMs(maxFrequencyMs - Number(target.value))
                    }}
                    marks={[
                        { value: minFrequencyMs, label: "Slow" },
                        { value: maxFrequencyMs, label: "Fast" }
                    ]}
                    sx={{
                        marginRight: "20px",
                        marginLeft: "10px",
                        '& .MuiSlider-markLabel': {
                            fontSize: '1.0rem',
                            color: `${coolColor}`,
                        },
                    }}
                />
                <div style={{margin: "0px", color: `${coolColor}`}}>Score: {score}
                    <Fab
                        color="secondary"
                        variant="extended"
                        sx={{ 
                            fontSize: '0.65rem',
                            color: `${coolColor}`
                        }} 
                        onClick={restartGame}
                    >
                      <ReplayIcon sx={{ ml: -1 }} /> Restart
                    </Fab>
                </div>
            </div>
        </Box>
    </>;
}

export default SnakeController;
