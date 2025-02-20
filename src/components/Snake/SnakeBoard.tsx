import React, { useState, useEffect, useCallback } from "react";
import Snake from './Snake';
import './Snake.css';

function SnakeBoard() {
    const gridSize = 20;
    const updateFrequencyMs = 1000;

    const [snake, setSnake] = useState(new Snake());
    const [snakeCoords, setSnakeCoords] = useState(snake.getPositions());

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        switch (e.key) {
            case "ArrowUp":
                console.log("up key pressed");
                snake.setDirection("up");
                break;
            case "ArrowDown":
                console.log("down key pressed");
                snake.setDirection("down");
                break;
            case "ArrowLeft":
                console.log("left key pressed");
                snake.setDirection("left");
                break;
            case "ArrowRight":
                console.log("right key pressed");
                snake.setDirection("right");
                break;
            case " ":
                console.log("space key pressed");
                snake.tick(false);
                break;
            case "r":
                console.log("r key pressed");
                setSnake(new Snake());
                break;
            default:
                console.log("Invalid key");
                break;
        }
    }, [snake]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [snake]);

    useEffect(() => {
        const interval = setInterval(() => {
            console.log("tick: " + snake.getHead());
            snake.tick(false);
            setSnakeCoords(snake.getPositions());
        }, updateFrequencyMs);
        return () => {
            clearInterval(interval);
        };
    }, [snake]);

    return (
        <div className="grid">
            {Array(gridSize).fill(0).map((_, row) => (
                <div key={row} className="row">
                    {Array(gridSize).fill(0).map((_, col) => {
                        let className = "cell";
                        if (snakeCoords.some(([r, c]) => r === row && c === col)) {
                            className += " snake";
                        }
                        return <div key={col} className={className}/>;
                    })}
                </div>
            ))}
        </div>
    )
}

export default SnakeBoard;