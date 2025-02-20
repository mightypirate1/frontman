class Snake {
    private direction: string;
    private positions: [number, number][];

    // constructor(
    //     startingPositions: [number, number][],
    //     direction: string,
    // ) {
    //     this.positions = startingPositions;
    //     this.direction = direction;
    // }

    constructor() {
        this.positions = [[5, 7], [5, 6], [5, 5]];
        this.direction = "right";
    }

    public tick(eat: boolean): void {
        const newHead = this.getTickedHead();
        this.positions.unshift(newHead);
        if (!eat) {
            this.positions.pop();
        }
    }

    public getHead(): [number, number] {
        return this.positions[0];
    }

    public getPositions(): [number, number][] {
        return this.positions.slice();
    }

    public setDirection(direction: string): void {
        this.direction = direction;
    }

    private getTickedHead(): [number, number] {
        const head = this.getHead();
        switch (this.direction) {
            case "up":
                return [head[0] - 1, head[1]];
            case "down":
                return [head[0] + 1, head[1]];
            case "left":
                return [head[0], head[1] - 1];
            case "right":
                return [head[0], head[1] + 1];
            default:
                return head;
        }
    }
}

export default Snake;
