import Coord from "../Grid/Coord";
import Food from "./Food";
import './Snake.css';

/**
 * Renders the game.
 */
function SnakeBoard(snakeCoords: Coord[], foods: Food[], gridSize: number) {
    return (
        <div className="grid">
            {Array(gridSize).fill(0).map((_, row) => (
                <div key={row} className="row">
                    {Array(gridSize).fill(0).map((_, col) => {
                        let className = "cell";
                        if (snakeCoords.some(c => c.equals(row, col))) {
                            className += " snake";
                        }
                        if (foods.some(food => food.isAt(row, col))) {
                            className += " food";
                        }
                        return <div key={col} className={className}/>;
                    })}
                </div>
            ))}
        </div>
    )
}

export default SnakeBoard;