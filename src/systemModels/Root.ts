import {GameObject} from "./GameObject.ts";
import {Vector2} from "./Vector2.ts";
import {DrawLayersEnum} from "../types/enum/DrawLayers.enum.ts";
import {IGameLogicHandler} from "../types/interface/IGameLogicHandler.ts";
import {GameObjectInterface} from "../types/dto_interface/GameObject.Interface.ts";
import {HtmlRenderer} from "./HtmlRenderer.ts";
import {events} from "../services/EventService.ts";
import {EventProtocolEnum} from "../types/enum/EventProtocol.enum.ts";
import {MqttService} from "../services/MqttService.ts";

export class Root extends GameObject {
    private _htmlRenderer: HtmlRenderer;
    private _gameClient: null = null;
    private _gameLogicHandler?: IGameLogicHandler;
    // @ts-ignore
    private _mqttService: MqttService;

    constructor(document: Document, fields?: GameObjectInterface) {
        super(fields);
        this.position = new Vector2(0,0);
        this._htmlRenderer = new HtmlRenderer(document);
        this._mqttService = new MqttService();
    }

    onInit() {
        // this._htmlRenderer.showConstructionScreen(true);
        this._htmlRenderer.showHomeScreen(true);
        setTimeout(() => {
            // otherwise the events are not yet subscribed on the receiving end.
            events.emit(EventProtocolEnum.ShowMobileOverlay, false, false)
            events.emit(EventProtocolEnum.MQTT_SubscribeToTopic, false, "openLobbies");
        }, 1)
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