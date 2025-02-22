import Coord from "../Grid/Coord";


class Food {
    private position: Coord;

    constructor(position: Coord) {
        this.position = position;
    }

    public getPosition(): Coord {
        return this.position;
    }

    public isAt(x: number, y: number): boolean;
    public isAt(coord: Coord): boolean;
    public isAt(x: number | Coord, y?: number): boolean {
        if (x instanceof Coord) {
            return this.position.equals(x);
        }
        return this.position.equals(x, y!);
    }
}

export default Food;
