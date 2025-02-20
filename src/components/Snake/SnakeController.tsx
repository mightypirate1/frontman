import { useState, useEffect, useCallback } from "react";
import SnakeBoard from "./SnakeBoard";
import SnakeGame from "./SnakeGame";

function SnakeController() {
    const gridSize = 20;
    const updateFrequencyMs = 300;

    const [game, setGame] = useState(new SnakeGame(gridSize));
    const [snakeCoords, setSnakeCoords] = useState(game.getSnakeCoords());
    const [foods, setFoods] = useState(game.getFoods());

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
                const newGame = new SnakeGame(gridSize);
                setGame(newGame);
                setSnakeCoords(game.getSnakeCoords());
                setFoods(game.getFoods());
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
            console.log("tick: " + foods);
            game.tick();
            setSnakeCoords(game.getSnakeCoords());
            setFoods(game.getFoods());
        }, updateFrequencyMs);
        return () => {
            clearInterval(interval);
        };
    }, [game]);

    return SnakeBoard(snakeCoords, foods, gridSize);
}

export default SnakeController;
