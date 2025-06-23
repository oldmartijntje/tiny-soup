import {DrawFunction, UpdateFunction} from "./patterns/SystemTypes.ts";
import {GameLoop} from "./models/GameLoop.ts";

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

// const mainScene = new Main({
//     position: new Vector2(0, 0),
// });
// mainScene.addChild(databank);
// mainScene.setLevel(new Menu());
// mainScene.registerMouseMovement(canvas);
//
const update: UpdateFunction = (deltaTime: number) => {
    // TODO:
    // mainScene.stepEntry(deltaTime, mainScene);
    // mainScene.input?.update();
};

const draw: DrawFunction = () => {
    // TODO:
    // ctx.clearRect(0, 0, canvas.width, canvas.height);
    // mainScene.drawBackground(ctx);
    //
    // ctx.save();
    //
    // if (mainScene.camera) {
    //     ctx.translate(canvas.width / 2, canvas.height / 2);
    //     ctx.scale(mainScene.camera.zoom, mainScene.camera.zoom);
    //     ctx.translate(-canvas.width / 2 + mainScene.camera.position.x, -canvas.height / 2 + mainScene.camera.position.y);
    // }
    //
    // mainScene.drawObjects(ctx);
    // ctx.restore();
    // mainScene.drawForeground(ctx);
};

const gameLoop = new GameLoop(update, draw);
gameLoop.start();
