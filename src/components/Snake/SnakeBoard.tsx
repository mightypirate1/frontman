import React, { useState, useEffect } from "react";
import Snake from './Snake';
import './Snake.css';

function SnakeBoard() {
    const gridSize = 20;
    const updateFrequencyMs = 1000;

    const [snake, setSnake] = useState(new Snake());
    const handleKeyDown = (e: KeyboardEvent) => {
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
            default:
                console.log("Invalid key");
                break;
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [snake]);

    useEffect(() => {
        const interval = setInterval(() => {
            snake.tick(false);
        }, updateFrequencyMs);
        return () => {
            clearInterval(interval);
        };
    }, [snake]);

    const snakeCoords = snake.getPositions();
    return (
        <div className="snake_board">
            {[...Array(gridSize)].map((_, row) => (
                <div key={row} className="row">
                    {[...Array(gridSize)].map((_, col) => (
                        <div
                            key={col}
                            className={
                                `cell ${snakeCoords.some(([r, c]) => r === row && c === col) ? "snake" : ""}`
                            }
                        ></div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default SnakeBoard;