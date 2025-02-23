use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Terrarium {
    height: usize,
    width: usize,
    grid: Vec<Vec<u8>>,
}

#[wasm_bindgen]
pub struct CoordRs {
    pub x: usize,
    pub y: usize,
}

#[wasm_bindgen]
impl Terrarium {
    pub fn new(height: usize, width: usize) -> Terrarium {
        let grid = vec![vec![0; width]; height];
        Terrarium {
            height,
            width,
            grid,
        }
    }

    pub fn toggle(&mut self, x: usize, y: usize) {
        self.grid[y][x] = if self.grid[y][x] == 0 { 1 } else { 0 };
    }

    pub fn set(&mut self, x: usize, y: usize, value: u8) {
        self.grid[y][x] = value;
    }

    pub fn get_cells(&self) -> Vec<CoordRs> {
        let mut cells = Vec::new();
        for y in 0..self.grid.len() {
            for x in 0..self.grid[y].len() {
                if self.grid[y][x] > 0 {
                    cells.push(CoordRs { x, y });
                }
            }
        }
        cells
    }

    /**
        Updates the grid based on the rules of the Game of Life.
        If `boundary_lives` is true, cells on the boundary are considered alive.

        The resulting grid has a 0 for all dead cells, and an integer representing the number
        of iterations they have been alive for (1 for the ones created in this tick).
    */
    pub fn tick(&mut self, boundary_lives: bool) {
        let mut n_neighbors = vec![vec![0; self.width]; self.height];
        for h in 0..self.height {
            for w in 0..self.width {
                for dh in -1..=1 {
                    for dw in -1..=1 {
                        if dh == 0 && dw == 0 {
                            continue;
                        }
                        let nh = h as isize + dh;
                        let nw = w as isize + dw;
                        let contrib = if nw < 0
                            || nw >= self.width as isize
                            || nh < 0
                            || nh >= self.height as isize
                        {
                            if boundary_lives {
                                1
                            } else {
                                0
                            }
                        } else {
                            if self.grid[nh as usize][nw as usize] > 0 {
                                1
                            } else {
                                0
                            }
                        };
                        n_neighbors[h][w] += contrib;
                    }
                }
            }
        }

        for h in 0..self.height {
            for w in 0..self.width {
                let n = n_neighbors[h][w];
                let cell_is_alive = self.grid[h][w] > 0;
                let new_cell = match (cell_is_alive, n) {
                    (false, 3) => 1,
                    (true, 2) | (true, 3) => {
                        if self.grid[h][w] == 255 {
                            255
                        } else {
                            self.grid[h][w] + 1
                        }
                    },
                    _ => 0,
                };
                self.grid[h][w] = new_cell;
            }
        }
    }
}
