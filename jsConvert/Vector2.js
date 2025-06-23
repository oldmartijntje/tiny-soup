import { config } from "../config.js";
import { UP, DOWN, LEFT, RIGHT } from "./Input.js";

export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    duplicate() {
        return new Vector2(this.x, this.y);
    }

    matches(otherVector2) {
        return this.x === otherVector2.x && this.y === otherVector2.y;
    }

    toString() {
        return `Vector2(${this.x}, ${this.y})`;
    }

    toNeighbor(direction) {
        let x = this.x;
        let y = this.y;
        switch (direction) {
            case UP:
                y -= config.sizes.gridSize;
                break;
            case DOWN:
                y += config.sizes.gridSize;
                break;
            case LEFT:
                x -= config.sizes.gridSize;
                break;
            case RIGHT:
                x += config.sizes.gridSize;
                break;
        }
        if (x == this.x && y == this.y) {
            throw new Error('Invalid direction ' + direction + ' for ' + this.toString());
        }
        return new Vector2(x, y);
    }
}