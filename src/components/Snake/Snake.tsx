import Coord from "../Grid/Coord";


class Snake {
    private direction: string;
    private positions: Coord[];
    private lastTickDirection: string;
    private growth: number;
    private keyPressQueue: string;
    private keyPressedThisTick: boolean;

    constructor() {
        this.positions = [
            Coord.new(5, 7),
            Coord.new(5, 6),
            Coord.new(5, 5),
        ];
        this.direction = "right";
        this.lastTickDirection = "right";
        this.growth = 0;
        this.keyPressQueue = "";
        this.keyPressedThisTick = false;
    }

    public getHead(): Coord {
        return this.positions[0];
    }

    public getPositions(): Coord[] {
        return this.positions.slice();
    }

    public tick(): void {
        this.lastTickDirection = this.direction;
        const newHead = this.getTickedHead();
        this.positions.unshift(newHead);
        if (this.growth == 0) {
            this.positions.pop();
        } else {
            this.growth -= 1;
        }

        if (this.keyPressQueue !== "") {
            this.keyPressedThisTick = false;
            const direction = this.keyPressQueue;
            this.keyPressQueue = "";
            this.setDirection(direction);
        }
        this.keyPressedThisTick = false;
    }

    public eat(): void {
        this.growth += 1;
    }

    public isDead(maxX: number, maxY: number): boolean {
        const head = this.getHead();
        if (head.x < 0 || head.x >= maxX) {
            return true;
        }
        if (head.y < 0 || head.y >= maxY) {
            return true;
        }
        const rest = this.positions.slice(1);
        return rest.some(c => c.equals(head));
    }

    public setDirection(direction: string): void {
        if (!this.keyPressedThisTick) {
            if (this.oppositeDirection(this.lastTickDirection, direction)) {
                return;
            }
            this.direction = direction;
            this.keyPressedThisTick = true;
            return;
        }
        // If the action is not applicably, we queue it up
        this.keyPressQueue = direction;
    }

    private oppositeDirection(directionA: string, directionB: string): boolean {
        return (
            (directionA === "up" && directionB === "down")
            || (directionA === "down" && directionB === "up")
            || (directionA === "left" && directionB === "right")
            || (directionA === "right" && directionB === "left")
        );
    }

    private getTickedHead(): Coord {
        const head = this.getHead();
        switch (this.direction) {
            case "up":
                return Coord.new(head.x - 1, head.y);
            case "down":
                return Coord.new(head.x + 1, head.y);
            case "left":
                return Coord.new(head.x, head.y - 1);
            case "right":
                return Coord.new(head.x, head.y + 1);
            default:
                return head;
        }
    }
}

export default Snake;
