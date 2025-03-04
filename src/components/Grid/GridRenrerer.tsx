import { Box } from "@mui/material";
import Coord from "./Coord";
import './Grid.css';

function GridRenderer(
    dimensions: [number, number],
    cellSize: [number, number],
    coloredCoords: Map<string, string>,
    backgroundColor: string,
    border: string = "1px solid black",
) {
    const [height, width] = dimensions;
    const [cellHeight, cellWidth] =
        cellSize.map(size => `${size}px`);
    return (
        <div className="grid">
            {Array(height).fill(0).map((_, row) => (
                <div key={row} className="row">
                    {Array(width).fill(0).map((_, col) => {
                        const cellCoord = new Coord(row, col);
                        const cellColor = coloredCoords.get(cellCoord.asKey());
                        return (
                            <Box className="cell"
                                key={col}
                                sx={{
                                    backgroundColor: cellColor ?? backgroundColor,
                                    height: cellHeight,
                                    width: cellWidth,
                                    border: border,
                                }}
                            />
                        )
                    })}
                </div>
            ))}
        </div>
    )
}

export default GridRenderer;
