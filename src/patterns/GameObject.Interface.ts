import {DrawLayersEnum} from "./DrawLayers.enum.ts";
import {GameObject} from "../models/GameObject.ts";
import {Vector2} from "../models/Vector2.ts";

export interface GameObjectInterface {
    position: Vector2;
    children: GameObject[];
    parent: GameObject | null;
    hasBeenInitiated: boolean;
    drawLayer: DrawLayersEnum | null;
}