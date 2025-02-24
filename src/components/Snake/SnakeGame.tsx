import Coord from "../Grid/Coord";
import Food from "./Food";
import Snake from "./Snake";

class SnakeGame {
    private gridSize: number;
    private score: number;
    private autoSpawnFood: boolean;
    private snake: Snake;
    private foods: Food[];

    constructor(gridSize: number, autoSpawnFood: boolean = true) {
        this.gridSize = gridSize;
        this.score = 0;
        this.autoSpawnFood = autoSpawnFood;
        this.snake = new Snake();
        this.foods = [];
        if (this.autoSpawnFood) {
            this.spawnFood();
        }
    }

    public getSnakeCoords(): Coord[] {
        return this.snake.getPositions();
    }

    public setDirection(direction: string): void {
        this.snake.setDirection(direction);
    }

    public getFoods(): Food[] {
        return this.foods;
    }

    public fakeEat(): void {
        this.snake.eat();
        this.score += 1;
    }

    public tick(): number {
        let reward = 0;
        if (this.snake.isDead(this.gridSize, this.gridSize)) {
            return reward;
        }
        this.snake.tick();
        const head = this.snake.getHead();
        const eaten = this.foods
            .filter(food => food.isAt(head));
        eaten.forEach(_ => {
            this.snake.eat();
        });
        if (eaten.length > 0) {
            if (this.autoSpawnFood) {
                this.spawnFood();
            }
            this.score += eaten.length;
            reward += eaten.length;
        }
        this.foods = this.foods.filter(food => !food.isAt(head));
        return reward;
    }

    public gameOver(): boolean {
        return this.snake.isDead(this.gridSize, this.gridSize);
    }

    public getScore(): number {
        return this.score;
    }

    public spawnFood(): void {
        let allCoords = [];
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                allCoords.push(Coord.new(i, j));
            }
        }
        let occupiedCoords = this.snake.getPositions().concat(
            this.foods.map(f => f.getPosition())
        );
        const freeCoords = allCoords.filter(c => !occupiedCoords.some(oc => oc.equals(c)));
        if (freeCoords.length === 0) {
            return;
        }
        const coord = this.randomCoord(freeCoords);
        const newFood = new Food(coord);
        this.foods.push(newFood);
    }

    private randomCoord(coords: Coord[]): Coord {
        const randomIndex = Math.floor(Math.random() * coords.length);
        return coords[randomIndex];
    }
}

export default SnakeGame;
