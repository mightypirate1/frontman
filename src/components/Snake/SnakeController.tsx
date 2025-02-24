import { useState, useEffect, useCallback } from "react";
import { Alert, Box, Fab, Paper, Slider, Snackbar } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';

import SnakeGame from "./SnakeGame";
import GridRenderer from "../Grid/GridRenrerer";

function SnakeController() {
    const snakeColor = "#61dafb";
    const foodColor = "#ff6347";
    const emptyColor = "#282c34";
    const gridSize = 20;
    const borderWidthPx = 1;
    const cellPxSize = 30;
    const boardPxSize = gridSize * (2 * borderWidthPx + cellPxSize);
    const minFrequencyMs = 10;
    const maxFrequencyMs = 300;
    const coolColor = "#870089";

    const [score, setScore] = useState(0);
    const [updateFrequencyMs, setUpdateFrequencyMs] = useState(300);
    const [game, setGame] = useState(new SnakeGame(gridSize));
    const [coordColors, setCoordColors] = useState(new Map<string, string>());
    const [gameOver, setGameOver] = useState(false);

    const render = () => {
        return GridRenderer(
            [gridSize, gridSize],
            [cellPxSize, cellPxSize],
            coordColors,
            emptyColor,
            `${borderWidthPx}px solid black`,
        );
    };

    const getCoordColors = (game: SnakeGame) => {
        const coordColors = new Map();
        for (const coord of game.getSnakeCoords()) {
            coordColors.set(coord.asKey(), snakeColor);
        }
        for (const food of game.getFoods()) {
            coordColors.set(food.getPosition().asKey(), foodColor);
        }
        return coordColors;
    }

    const restartGame = () => {
        const newGame = new SnakeGame(gridSize);
        setGame(newGame);
        setScore(0);
        setGameOver(false);
        setCoordColors(getCoordColors(game));
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
            setCoordColors(getCoordColors(game));
        }, updateFrequencyMs);
        return () => {
            clearInterval(interval);
        };
    }, [game, updateFrequencyMs]);

    const board = render();
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
        <Paper elevation={15} sx={{ width: `${boardPxSize}px` }}>{board}</Paper>
        <Box component="section" color="secondary" sx={{ p: "10px",  width: `${boardPxSize}px` }}>
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
