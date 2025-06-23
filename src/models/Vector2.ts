import {DirectionEnum} from "../patterns/Direction.enum.ts";
import {gameConfig} from "../patterns/GameConfig.interface.ts";


/**
 * The object that handles coordinate logic.
 */
export class Vector2 {
    private x: number;
    private y: number;

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    /**
     * Get the X of this vector.
     */
    public getX(): number {
        return this.x;
    }

    /**
     * Get the Y of this vector.
     */
    public getY(): number {
        return this.y;
    }

    /**
     * Return a new Vector2 with the same coordinates.
     */
    duplicate(): Vector2 {
        return new Vector2(this.x, this.y);
    }


    /**
     * Check whether 2 vector2's are the same coordinate.
     */
    matches(otherVector2: Vector2): boolean {
        return this.x === otherVector2.x && this.y === otherVector2.y;
    }

    /**
     * Convert a vector2 into a string.
     */
    toString(): string {
        return `Vector2(${this.x}, ${this.y})`;
    }

    /**
     * Create a new vector2 at a neighbouring location.
     */
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