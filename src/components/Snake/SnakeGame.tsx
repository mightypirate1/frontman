import Coord from "./Coord";
import Food from "./Food";
import Snake from "./Snake";

class SnakeGame {
    private gridSize: number;
    private snake: Snake;
    private foods: Food[];

    constructor(gridSize: number) {
        this.gridSize = gridSize;
        this.snake = new Snake();
        this.foods = [];
        this.spawnFood();
    }

    public getSnakeCoords(): Coord[] {
        return this.snake.getPositions();
    }

    public setDirection(direction: string): void {
        this.snake.setDirection(direction);
    }

    public getFoods(): Food[] {
        return this.foods.slice();
    }

    public tick(): void {
        if (this.snake.isDead(this.gridSize, this.gridSize)) {
            return;
        }
        this.snake.tick();
        const head = this.snake.getHead();
        const eaten = this.foods
            .filter(food => food.isAt(head));
        eaten.forEach(_ => {
            this.snake.eat();
        });
        if (eaten.length > 0) {
            this.spawnFood();
        }
        this.foods = this.foods.filter(food => !food.isAt(head));
    }

    public spawnFood(): void {
        const coord = this.uniqueRandomCoord();
        const newFood = new Food(coord);
        this.foods.push(newFood);
    }

    private uniqueRandomCoord(): Coord {
        let coord: Coord;
        do {
            const x = Math.floor(Math.random() * this.gridSize);
            const y = Math.floor(Math.random() * this.gridSize);
            coord = Coord.new(x, y);
        } while (
            this.snake.getPositions().some(c => c.equals(coord))
            || this.foods.some(f => f.isAt(coord))
        );
        return coord;
    }
}

export default SnakeGame;
