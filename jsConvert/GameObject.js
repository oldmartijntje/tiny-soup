import { events } from "./Events.js";
import { Vector2 } from "./Vector2.js";

export class GameObject {
    constructor({ position }) {
        this.position = position ?? new Vector2(0, 0);
        this.children = [];
        this.parent = null;
        this.hasBeenInitiated = false;
        this.isSolid = false;
        this.drawLayer = null;
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

    onInit() {
        // override this method
    }

    // called once per frame
    step(_deltaTime, root) {
        // override this method
    }

    draw(ctx, x, y) {
        const drawPosX = x + this.position.x;
        const drawPosY = y + this.position.y;

        // Do the actual rendering for Images
        this.drawImage(ctx, drawPosX, drawPosY);

        // call the draw method for all children
        this.getDrawChildrenOrdered().forEach(child => child.draw(ctx, drawPosX, drawPosY));
    }

    getDrawChildrenOrdered() {
        return [...this.children].sort((a, b) => {
            if (b.drawLayer === "FLOOR") {
                return 1;
            }
            return a.position.y > b.position.y ? 1 : -1;
        });
    }

    drawImage(_ctx, _x, _y) {
        // override this method
    }

    destroy() {
        this.children.forEach(child => child.destroy());
        if (this.parent) {
            this.parent.removeChild(this);
        }
    }

    addChild(gameObject) {
        gameObject.parent = this
        this.children.push(gameObject);
    }

    removeChild(gameObject) {
        events.unsubscribe(gameObject);
        this.children = this.children.filter(child => child !== gameObject);
    }
}