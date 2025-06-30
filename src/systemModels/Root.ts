import {GameObject} from "./GameObject.ts";
import {Vector2} from "./Vector2.ts";
import {DrawLayersEnum} from "../types/enum/DrawLayers.enum.ts";
import {IGameLogicHandler} from "../types/interface/IGameLogicHandler.ts";
import {GameObjectInterface} from "../types/dto_interface/GameObject.Interface.ts";

export class Root extends GameObject {
    _htmlRenderen: null = null;
    _gameClient: null = null;
    _gameLogicHandler?: IGameLogicHandler;

    constructor(fields?: GameObjectInterface) {
        super(fields);
        this.position = new Vector2(0,0);
    }

    onInit() {

    }

    /**
     * Draw all things in the background.
     * @param _ctx
     */
    drawBackground(_ctx: CanvasRenderingContext2D) {
        // TODO: render the game
        // this.level?.background.drawImage(_ctx, 0, 0)
    }

    /**
     * Draw all gameObjects in the scene
     * @param _ctx
     */
    drawObjects(_ctx: CanvasRenderingContext2D) {
        this.children.forEach(child => {
            if (child.drawLayer !== DrawLayersEnum.HUD) {
                child.draw(_ctx, 0, 0);
            }
        });
    }

    /**
     * Draw all things in the foreground
     * @param _ctx
     */
    drawForeground(_ctx: CanvasRenderingContext2D) {
        this.children.forEach(child => {
            if (child.drawLayer === DrawLayersEnum.HUD) {
                child.draw(_ctx, 0, 0);
            }
        });
    }


}