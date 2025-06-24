import {GameObject} from "./GameObject.ts";
import {GameObjectInterface} from "../types/interface/GameObject.Interface.ts";
import {Vector2} from "./Vector2.ts";
import {DrawLayersEnum} from "../types/enum/DrawLayers.enum.ts";
import {events} from "./EventHandler.ts";
import {EventProtocolEnum} from "../types/enum/EventProtocol.enum.ts";
import {registry} from "./Registerer.ts";
import {RegistererTypesEnum} from "../types/enum/RegistererTypes.enum.ts";

export class Root extends GameObject {
    constructor(fields?: GameObjectInterface) {
        super(fields);
        this.position = new Vector2(0,0);
    }

    onInit() {
        events.emit(EventProtocolEnum.TEST, false)
        registry.registerMe(this, RegistererTypesEnum.ROOT_OBJECT, false)
        const claimables = registry.findAvailable(RegistererTypesEnum.ROOT_OBJECT);
        this._logger.StringifyObject(claimables).LogDebug();
        if (claimables.length >= 1) {
            this._logger.StringifyObject(claimables[0].ClaimEntry(this, RegistererTypesEnum.ROOT_OBJECT)).LogDebug();
        }
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