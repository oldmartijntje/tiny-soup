import {DrawLayersEnum} from "../enum/DrawLayers.enum.ts";
import {GameObject} from "../../systemModels/GameObject.ts";
import {Vector2} from "../../systemModels/Vector2.ts";

export interface GameObjectInterface {
    position: Vector2;
    children: GameObject[];
    parent: GameObject | null;
    hasBeenInitiated: boolean;
    drawLayer: DrawLayersEnum | null;
}