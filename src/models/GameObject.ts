// import { events } from "./Events.js";
import {DrawLayersEnum} from "../patterns/DrawLayers.enum.ts";
import {GameObjectInterface} from "../patterns/GameObject.Interface.ts";
import {Vector2} from "./Vector2.ts";

export abstract class GameObject {
    position: Vector2;
    children: GameObject[];
    parent: GameObject | null;
    hasBeenInitiated: boolean;
    drawLayer: DrawLayersEnum | null;

    protected constructor(fields: GameObjectInterface) {
        this.position = fields.position ?? new Vector2(0, 0);
        this.children = fields.children ?? [];
        this.hasBeenInitiated = false;
        this.drawLayer = fields.drawLayer ?? null;
        this.parent = fields.parent ?? null;
    }

    // First entry point of the loop
    stepEntry(deltaTime, root) {
        // call the stepEntry method for all children
        this.children.forEach(child => child.stepEntry(deltaTime, root));

        // if the ready method has not been called yet, call it
        if (!this.hasBeenInitiated) {
            this.hasBeenInitiated = true;
            this.onInit();
        }

        // call the step method
        this.step(deltaTime, root);
    }

    abstract onInit(): void

    // called once per frame
    abstract step(_deltaTime, root): void

    public draw(ctx, x, y) {
        const drawPosX = x + this.position.x;
        const drawPosY = y + this.position.y;

        // Do the actual rendering for Images
        this.drawImage(ctx, drawPosX, drawPosY);

        // call the draw method for all children
        this.getDrawChildrenOrdered().forEach(child => child.draw(ctx, drawPosX, drawPosY));
    }

    private getDrawChildrenOrdered() {
        return [...this.children].sort((a, b) => {
            if (b.drawLayer === "FLOOR") {
                return 1;
            }
            return a.position.y > b.position.y ? 1 : -1;
        });
    }

    abstract drawImage(_ctx, _x, _y): void

    public destroy() {
        this.children.forEach(child => child.destroy());
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    public addChild(gameObject) {
        gameObject.parent = this
        this.children.push(gameObject);
    }

    public removeChild(gameObject) {
        events.unsubscribe(gameObject);
        this.children = this.children.filter(child => child !== gameObject);
    }
}