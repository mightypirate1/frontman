class Coord {
    x: number;
    y: number;  
    
    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    public static new(x: number, y: number): Coord {
        return new Coord(x, y);
    }

    public asKey(): string {
        return `coord[${this.x},${this.y}]`;
    }

    public equals(other: Coord): boolean;
    public equals(x: number, y: number): boolean;
    public equals(arg1: Coord | number, arg2?: number): boolean {
        if (arg1 instanceof Coord) {
            return this.x === arg1.x && this.y === arg1.y;
        } else if (typeof arg1 === "number" && typeof arg2 === "number") {
            return this.x === arg1 && this.y === arg2;
        }
        return false;
    }
}

export default Coord;