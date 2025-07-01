// import { events } from "./Events.js";
import {DrawLayersEnum} from "../types/enum/DrawLayers.enum.ts";
import {GameObjectInterface} from "../types/dto_interface/GameObject.Interface.ts";
import {Vector2} from "./Vector2.ts";
import {SystemLogic} from "./SystemLogic.ts";
import {Destroyable} from "./Destroyable.ts";
import {events} from "../services/EventService.ts";

/**
 * Anything in the game that needs support for rendering, or interacting with others, is a gameobject.
 */
export abstract class GameObject extends SystemLogic implements Destroyable {
    public position: Vector2;
    public children: GameObject[];
    public parent: GameObject | null;
    public drawLayer: DrawLayersEnum | null;

    constructor(fields?: GameObjectInterface) {
        super();
        this.position = fields?.position ?? new Vector2(0, 0);
        this.children = fields?.children ?? [];
        this.drawLayer = fields?.drawLayer ?? null;
        this.parent = fields?.parent ?? null;
    }

    /**
     * First entrypoint of the gameloop.
     */
    stepEntry(deltaTime: number, root: GameObject) {
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



    /**
     * Called once per gametick. You can overwrite this, but it is not needed.
     */
    step(_deltaTime: number, _root: GameObject): void {

    }


    /**
     * Rendering of this gameobject, and all its children.
     */
    public draw(ctx: CanvasRenderingContext2D, x: number, y: number) {
        const drawPosX = x + this.position.x;
        const drawPosY = y + this.position.y;

        // Do the actual rendering for Images
        this.drawImage(ctx, drawPosX, drawPosY);

        // call the draw method for all children
        this.getDrawChildrenOrdered().forEach(child => child.draw(ctx, drawPosX, drawPosY));
    }

    /**
     * Find the correct order to draw all children.
     */
    private getDrawChildrenOrdered() {
        return [...this.children].sort((a, b) => {
            if (b.drawLayer === DrawLayersEnum.Floor) {
                return 1;
            }
            return a.position.y > b.position.y ? 1 : -1;
        });
    }

    /**
     * A method you could overwrite to draw images.
     */
    drawImage(_ctx: CanvasRenderingContext2D, _x: number, _y: number): void {

    }

    /**
     * Destroy it and it's children.
     */
    public destroy() {
        this.children.forEach(child => child.destroy());
        if (this.parent) {
            this.parent.removeChild(this);
        }
        events.unsubscribe(this);
    }


    /**
     * Add a child.
     */
    public addChild(gameObject: GameObject) {
        gameObject.parent = this
        this.children.push(gameObject);
    }

    /**
     * remove the child gameobject.
     *
     * It could become an orphan floating around in memory.
     */
    public removeChild(gameObject: GameObject) {
        this.children = this.children.filter(child => child !== gameObject);
    }
}