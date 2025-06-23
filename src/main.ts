import {DrawFunction, UpdateFunction} from "./types/custom/SystemTypes.ts";
import {GameLoop} from "./systemModels/GameLoop.ts";
import {Root} from "./systemModels/Root.ts";

const canvas = document.querySelector("#game-canvas");
if (canvas == null) {
    throw Error("canvas is null");
}
if (canvas instanceof HTMLCanvasElement) {
} else {
    throw Error("canvas is not canvastype");
}
const ctx = canvas.getContext("2d");
if (ctx == null) {
    throw Error("ctx is null");
}

console.log("code works!")

const root = new Root();
// root.addChild(databank);
// root.setLevel(new Menu());
// root.registerMouseMovement(canvas);

const update: UpdateFunction = (deltaTime: number) => {
    root.stepEntry(deltaTime, root);
    // root.input?.update();
};

const draw: DrawFunction = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    root.drawBackground(ctx);

    ctx.save();

    // if (root.camera) {
    //     ctx.translate(canvas.width / 2, canvas.height / 2);
    //     ctx.scale(root.camera.zoom, root.camera.zoom);
    //     ctx.translate(-canvas.width / 2 + root.camera.position.x, -canvas.height / 2 + root.camera.position.y);
    // }

    root.drawObjects(ctx);
    ctx.restore();
    root.drawForeground(ctx);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.start();
