import {DirectionEnum} from "../patterns/Direction.enum.ts";
import {gameConfig} from "../patterns/GameConfig.interface.ts";

export class Vector2 {
    x: number;
    y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    duplicate(): Vector2 {
        return new Vector2(this.x, this.y);
    }

    matches(otherVector2: Vector2): boolean {
        return this.x === otherVector2.x && this.y === otherVector2.y;
    }

    toString(): string {
        return `Vector2(${this.x}, ${this.y})`;
    }

    toNeighbor(direction: DirectionEnum): Vector2 {
        let x = this.x;
        let y = this.y;
        switch (direction) {
            case DirectionEnum.UP:
                y -= gameConfig.gridSize;
                break;
            case DirectionEnum.DOWN:
                y += gameConfig.gridSize;
                break;
            case DirectionEnum.LEFT:
                x -= gameConfig.gridSize;
                break;
            case DirectionEnum.RIGHT:
                x += gameConfig.gridSize;
                break;
        }
        if (x == this.x && y == this.y) {
            throw new Error('Invalid direction ' + direction + ' for ' + this.toString());
        }
        return new Vector2(x, y);
    }
}