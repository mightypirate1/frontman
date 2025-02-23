import { useEffect, useRef, useState } from "react";
import { Box, FormControlLabel, FormGroup, Modal, Slider, Switch, Typography } from "@mui/material";
import InfoIcon from '@mui/icons-material/Info';

import Coord from "../Grid/Coord";
import GridRenderer from "../Grid/GridRenrerer";
import init, { Terrarium, CoordRs } from "../../frontman-wasm/wasm-frontman";

import modalPopupBoxStyle from "../styles";

function GameOfLife() {
    const height: number = 30;
    const width: number = 30;
    const borderPx: number = 1;
    const heightPx: number = 1000;
    const widthPx: number = 1000;
    const cellHeightPx = Math.round(heightPx / height);
    const cellWidthPx = Math.round(widthPx /  width);
    const lifeColor = "#ff6347";
    const emptyColor = "#282c34";
    // const coolColor = "#870089";
    const gridRef = useRef<HTMLDivElement>(null);
    
    const parseCoord = (coordRs: CoordRs) => {
        return Coord.new(coordRs.x, coordRs.y);
    };
    const render = (colorCoords: Map<string, string>) => {
        return GridRenderer(
            [height, width],
            [cellHeightPx, cellWidthPx],
            colorCoords,
            emptyColor,
            `${borderPx}px solid black`,
        );
    };

    const updateGrid = (terrarium: Terrarium) => {
        const colorCoords = new Map();
        terrarium.get_cells()
            .map(cRs => parseCoord(cRs))
            .forEach(coord => {
                colorCoords.set(coord.asKey(), lifeColor);
            });
        setColorCoords(colorCoords);
    };

    const tickAndUpdate = (terrarium: Terrarium) => {
        terrarium.tick(borderLives);
        updateGrid(terrarium);
    };

    const toggleBorderLivesSwitch = (_event: React.ChangeEvent<HTMLInputElement>) => {
        setBorderLives(prevState => !prevState);
    };
    const toggleAutoTickSwitch = (_event: React.ChangeEvent<HTMLInputElement>) => {
        setAutoTick(prevState => !prevState);
    };

    const handleClick = (e: React.MouseEvent) => {
        const clickOutOfBounds = (h: number, w: number) => {
            return w < 0 || h < 0 || w >= width || h >= height;
        };
        if (gridRef.current && terrarium !== null) {
            const rect = gridRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const w = Math.floor(x / (cellWidthPx + 1 * borderPx));
            const h = Math.floor(y / (cellHeightPx + 2 * borderPx));;
            if (!clickOutOfBounds(h, w)) {
                terrarium.toggle(h, w);
            }
            updateGrid(terrarium);
        }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === " " && terrarium !== null) {
            tickAndUpdate(terrarium);
        }
    };

    const helpModal = () => {
        return (
            <Modal
                open={helpOpen}
                onClose={() => setHelpOpen(false)}
                aria-labeledby="help-modal"
                aria-describedby="help-modal-description"
            >
                <Box sx={modalPopupBoxStyle}>
                    <Typography id="modal-modal-title" variant="h5" component="h2">
                      Interactive finite "Game of Life" toy
                    </Typography>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        You can click on the grid to toggle the cells as "alive" or "dead".
                        Pressing space will tick the simulation.
                        There are toggles for whether the border is considered alive,
                        and an auto-play feature with adjustable speed.
                    </Typography>
                </Box>
            </Modal>
        );
    };

    const [isWasmInitialized, setIsWasmInitialized] = useState(false);
    const [autoTick, setAutoTick] = useState(false);
    const [autoTickSpeed, setAutoTickSpeed] = useState(20);
    const [borderLives, setBorderLives] = useState(false);
    const [colorCoords, setColorCoords] = useState(new Map<string, string>());
    const [helpOpen, setHelpOpen] = useState(false);
    const [terrarium, setTerrarium] = useState<Terrarium | null>(null);
    
    useEffect(() => {
        if (autoTick) {
            return () => {};
        }
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [terrarium, autoTick, borderLives]);

    useEffect(() => {
        if (!autoTick) {
            return;
        }
        const interval = setInterval(() => {
            if (terrarium !== null) {
                tickAndUpdate(terrarium);
            }
        }, 1000 - 9 * autoTickSpeed);
        return () => clearInterval(interval);
    }, [terrarium, autoTick, autoTickSpeed, borderLives]);

    init().then(() => {
        if (isWasmInitialized) {
            return;
        }
        const terrarium = Terrarium.new(height, width);
        setTerrarium(terrarium);
        setIsWasmInitialized(true);
    });

    if (!isWasmInitialized) {
        return <div>Loading...</div>;
    }
    
    return (
        <div
        style={{ display: "flex" }}
        >   
            {helpModal()}
            <FormGroup> 
                <FormControlLabel control={
                    <Switch 
                        checked={borderLives}
                        onChange={toggleBorderLivesSwitch}
                    />
                } label="Border lives" />
                <FormControlLabel control={
                    <Switch 
                        checked={autoTick}
                        onChange={toggleAutoTickSwitch}
                    />
                } label="Auto tick" />
            <Box marginRight="15px">
                
                Tick speed
                <Slider 
                    {...(autoTick ? { disabled: false } : { disabled: true })}
                    aria-label="auto tick speed"
                    value={autoTickSpeed}
                    min={1}
                    max={100}
                    onChange={(_event, value) => setAutoTickSpeed(Number(value))}
                />
            </Box>
            <Box onClick={() => setHelpOpen(true)}>
                <InfoIcon/> What gives?
            </Box>
            </FormGroup>
            <div
                ref={gridRef}
                onClick={handleClick}
                style={{ width: widthPx, height: heightPx }}
            >
                {render(colorCoords)}
            </div>
        </div>
    );
}

export default GameOfLife;
