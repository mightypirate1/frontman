import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { Alert, Box, Fab, FormControlLabel, FormGroup, Paper, Slider, Snackbar, Switch } from "@mui/material";
import ReplayIcon from '@mui/icons-material/Replay';

import Coord from "../Grid/Coord";
import SnakeGame from "../Snake/SnakeGame";
import GridRenderer from "../Grid/GridRenrerer";
import init, { Terrarium, CoordRs } from "../../frontman-wasm/wasm-frontman";

function SnakeController() {
    const snakeColor = "#61dafb";
    const foodColor = "#870089";
    const lifeColor = "#ff6347";
    const emptyColor = "#282c34";
    const gridSize = 20;
    const borderWidthPx = 1;
    const cellPxSize = 30;
    const boardPxSize = gridSize * (2 * borderWidthPx + cellPxSize);
    const minGameFrequencyMs = 10;
    const maxGameFrequencyMs = 300;
    const minTerrariumFrequencyMs = 100;
    const maxTerrariumFrequencyMs = 3000;
    const coolColor = "#870089";

    // tick terrarium
    const terrariumTickMode: string = "timer"; // game | timer

    const parseCoord = (coordRs: CoordRs) => {
        return Coord.new(coordRs.x, coordRs.y);
    };
    const render = (coordColors: Map<string, string>) => {
        return GridRenderer(
            [gridSize, gridSize],
            [cellPxSize, cellPxSize],
            coordColors,
            emptyColor,
            `${borderWidthPx}px solid black`,
        );
    };

    const tickAndUpdateTerrarium = (terrarium: Terrarium, game: SnakeGame) => {
        // set some coords from the game as living in the terrarium
        const headCoord = game.getSnakeCoords()[0];
        game.getSnakeCoords().forEach(coord => {
            terrarium.set(coord.x, coord.y, snakeIsAlive ? 1 : 0);
        });
        terrarium.set(headCoord.x, headCoord.y, snakeHeadIsAlive ? 1 : 0);
        game.getFoods().forEach(food => {
            const coord = food.getPosition();
            terrarium.set(coord.x, coord.y, foodIsAlive ? 1 : 0);
        });
        terrarium.tick(false);
        updateGrid(terrarium, game);
    };

    const updateGrid = (terrarium: Terrarium, game: SnakeGame) => {
        const colorCoords = new Map();
        terrarium.get_cells()
            .map(cRs => parseCoord(cRs))
            .forEach(coord => {
                colorCoords.set(coord.asKey(), lifeColor);
            });
        game.getSnakeCoords().forEach(coord => {
            colorCoords.set(coord.asKey(), snakeColor);
        });
        game.getFoods().forEach(food => {
            colorCoords.set(food.getPosition().asKey(), foodColor);
        });
        setColorCoords(colorCoords);
    };

    // what counts as alive
    const [snakeIsAlive, setSnakeIsAlive] = useState(false);
    const [snakeHeadIsAlive, setSnakeHeadIsAlive] = useState(false);
    const [foodIsAlive, setFoodIsAlive] = useState(false);
    // misc settings
    const [numFoods, setNumFoods] = useState(3);
    // update speeds
    const [gameUpdateFrequencyMs, setGameUpdateFrequencyMs] = useState(maxGameFrequencyMs);
    const [terrariumUpdateFrequencyMs, setTerrariumUpdateFrequencyMs] = useState(maxTerrariumFrequencyMs);
    // initialization
    const [isWasmInitialized, setIsWasmInitialized] = useState(false);
    // game state
    const [game, setGame] = useState<SnakeGame | null>(null);
    const [gameOver, setGameOver] = useState(false);
    const [colorCoords, setColorCoords] = useState(new Map<string, string>());
    const [terrarium, setTerrarium] = useState<Terrarium | null>(null);
    

    const restartGame = () => {
        const newGame = new SnakeGame(gridSize);
        for (let i = 0; i < numFoods - 1; i++) {
            newGame.spawnFood();
        }
        setGame(newGame);
        setGameOver(false);
        const terrarium = Terrarium.new(gridSize, gridSize);
        setTerrarium(terrarium);
        updateGrid(terrarium, newGame);
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (game === null) {
            return;
        }
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
    }, [game, terrarium]);

    // game tick
    useEffect(() => {
        const interval = setInterval(() => {
            if (terrarium === null || game === null) {
                return;
            }
            const reward = game.tick();
            if (reward > 0 && terrariumTickMode === "game") {
                tickAndUpdateTerrarium(terrarium, game);
                game.getSnakeCoords().forEach(coord => {
                    terrarium.set(coord.x, coord.y, 0);
                });
            }
            if (game.gameOver()) {
                setGameOver(true);
            } else {
                const headCoord = game.getSnakeCoords()[0];
                terrarium.get_cells()
                    .map(cRs => parseCoord(cRs))
                    .filter(coord => headCoord.equals(coord))
                    .forEach(coord => {
                        terrarium.set(coord.x, coord.y, 0);
                        game.fakeEat();
                    });
                updateGrid(terrarium, game);
            }
        }, gameUpdateFrequencyMs);
        return () => {
            clearInterval(interval);
        };
    }, [game, terrarium, gameUpdateFrequencyMs]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (terrariumTickMode !== "timer" || terrarium === null || game === null) {
                return;
            }
            tickAndUpdateTerrarium(terrarium, game);
        }, terrariumUpdateFrequencyMs);
        return () => {
            clearInterval(interval);
        };
    }, [game, terrarium, terrariumUpdateFrequencyMs, snakeIsAlive, snakeHeadIsAlive, foodIsAlive]);

    // wasm init
    init().then(() => {
        if (isWasmInitialized) {
            return;
        }
        const terrarium = Terrarium.new(gridSize, gridSize);
        setTerrarium(terrarium);
        setIsWasmInitialized(true);
        restartGame();
    });
    
    if (!isWasmInitialized) {
        return <div>Loading...</div>;
    }

    if (game === null) {
        return <div>Error: no game! :-(</div>;
    }
    console.log(snakeIsAlive, snakeHeadIsAlive, foodIsAlive);
    const board = render(colorCoords);
    return <>
        <Snackbar
            open={gameOver}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={() => setGameOver(false)} severity="error" sx={{ width: '100%' }}>
                Game Over! Your score is {game.getScore()}.
            </Alert>
        </Snackbar>
        <Paper elevation={15} sx={{ width: `${boardPxSize}px` }}>{board}</Paper>
        <Box component="section" color="secondary" sx={{ p: "10px",  width: `${boardPxSize}px` }}>
            <div style={{ display: "flex", flexDirection: "row", alignItems: "center", margin: "0px" }}>
                <FormGroup sx={{ width: "100%" }}> 
                    <FormControlLabel control={
                        <Slider
                            value={maxGameFrequencyMs - gameUpdateFrequencyMs}
                            min={minGameFrequencyMs}
                            max={maxGameFrequencyMs}
                            color="secondary"
                            onChange={(e) => {
                                const target = e.target as HTMLInputElement;
                                setGameUpdateFrequencyMs(maxGameFrequencyMs - Number(target.value))
                            }}
                            marks={[
                                { value: minGameFrequencyMs, label: "Slow" },
                                { value: maxGameFrequencyMs, label: "Fast" }
                            ]}
                            sx={{
                                marginRight: "20px",
                                marginLeft: "10px",
                                '& .MuiSlider-markLabel': {
                                    fontSize: '1.0rem',
                                    color: `${coolColor}`,
                                },
                            }}
                        />}
                        labelPlacement="start"
                        label="Snake speed"
                    />
                    <FormControlLabel control={
                        <Slider
                            value={maxTerrariumFrequencyMs - terrariumUpdateFrequencyMs}
                            min={minTerrariumFrequencyMs}
                            max={maxTerrariumFrequencyMs}
                            color="secondary"
                            onChange={(e) => {
                                const target = e.target as HTMLInputElement;
                                setTerrariumUpdateFrequencyMs(maxTerrariumFrequencyMs - Number(target.value))
                            }}
                            marks={[
                                { value: minTerrariumFrequencyMs, label: "Slow" },
                                { value: maxTerrariumFrequencyMs, label: "Fast" }
                            ]}
                            sx={{
                                marginRight: "20px",
                                marginLeft: "10px",
                                '& .MuiSlider-markLabel': {
                                    fontSize: '1.0rem',
                                    color: `${coolColor}`,
                                },
                            }}
                        />}
                        labelPlacement="start"
                        label="GoL speed"
                    />
                    <FormControlLabel control={
                        <Slider
                            // aria-label="Temperature"
                            value={numFoods}
                            min={1}
                            max={20}
                            step={1}
                            valueLabelDisplay="auto"
                            // getAriaValueText={ numFoods.toString() }
                            color="secondary"
                            onChange={(e) => {
                                const target = e.target as HTMLInputElement;
                                setNumFoods(Number(target.value))
                            }}
                            marks={[
                                { value: 0, label: "1" },
                                { value: 20, label: "20" }
                            ]}
                            sx={{
                                marginRight: "20px",
                                marginLeft: "10px",
                                '& .MuiSlider-markLabel': {
                                    fontSize: '1.0rem',
                                    color: `${coolColor}`,
                                },
                            }}
                        />}
                        labelPlacement="start"
                        label="Number of food"
                    />
                    <FormControlLabel control={
                        <Switch
                            value={snakeIsAlive}
                            onChange={(_e: ChangeEvent<HTMLInputElement>) => {
                                setSnakeIsAlive(prevValue => !prevValue)
                            }}
                            sx={{ marginRight: "20px" }}
                        />}
                        labelPlacement="start"
                        label="Snake counts as alive"
                    />
                    <FormControlLabel control={
                        <Switch
                            value={snakeHeadIsAlive}
                            onChange={(_e: ChangeEvent<HTMLInputElement>) => {
                                setSnakeHeadIsAlive(prevValue => !prevValue)
                            }}
                            sx={{ marginRight: "20px" }}
                        />}
                        labelPlacement="start"
                        label="Snake head counts as alive"
                    />
                    <FormControlLabel control={
                        <Switch
                            value={foodIsAlive}
                            onChange={(_e: ChangeEvent<HTMLInputElement>) => {
                                setFoodIsAlive(prevValue => !prevValue)
                            }}
                            sx={{ marginRight: "20px" }}
                        />}
                        labelPlacement="start"
                        label="Food counts as alive"
                    />
                </FormGroup>
                <div style={{margin: "0px", color: `${coolColor}`}}>Score: {game.getScore()}
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
