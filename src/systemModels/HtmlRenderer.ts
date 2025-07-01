import {
    addEventListener,
    addQueryEventListeners,
    getElementByIdAndSetDisplay, getInputElementByIdAndSetValue
} from "../helpers/HtmlHelpers.ts";
import {events} from "../services/EventService.ts";
import {EventProtocolEnum} from "../types/enum/EventProtocol.enum.ts";
import {SystemLogic} from "./SystemLogic.ts";
import {memoryService} from "../services/MemoryService.ts";
import {gameConfig} from "../types/dto_interface/GameConfig.interface.ts";

const MODALS = ["constructionModal", "homeModal", "onlineMultiplayerSelectionModal", "joinMultiplayerGameModal", "hostMultiplayerGameModal"];

export class HtmlRenderer extends SystemLogic {
    private _document: Document;
    private _modalMemory: { [id: string] : boolean; } = {};

    constructor(document: Document) {
        super();
        this._document = document;
        MODALS.forEach((el) => {
            this._modalMemory[el] = false;
        })
    }

    onInit() {
        events.subscribe(EventProtocolEnum.ShowMobileOverlay, this, (data) => {
            if (typeof data.value === typeof true) {
                this.setMobileOverlay(data.value);
            } else {
                this._logger.LogDebug(`Received Event with Protocol ${EventProtocolEnum.ShowMobileOverlay} and the value is: ${data.value}`)
            }
        });

        events.subscribe(EventProtocolEnum.SetUsernameValue, this, () => {
            events.emit(EventProtocolEnum.MQTT_Broadcast, false, {topic: "openLobbies", message: memoryService.username});
            if (!getInputElementByIdAndSetValue(this._document, "usernameField", memoryService.username)) throw Error("Username Input field not defined.");
        });

        // online multiplayer gamemode button
        if (!addEventListener(this._document, "click", "gamemodeSelectButtonMultiplayerOnline", () => {
            if (!this._modalMemory["homeMenu"] || !this._modalMemory["homeModal"]) return;
            events.emit(events.advancedEventProtocol(EventProtocolEnum.SelectedGamemode, "MultiplayerOnline"), false, "MultiplayerOnline");
            this.prepareShowingOfMenu(true);
            this._modalMemory["onlineMultiplayerSelectionModal"] = true;
            getElementByIdAndSetDisplay(this._document, "onlineMultiplayerSelectionModal", "block");
        })) throw Error("ID does not exist.");

        // username input
        if (!addEventListener(this._document, "change", "usernameField", (event: Event) => {
            if (!this._modalMemory["homeMenu"] || !this._modalMemory["onlineMultiplayerSelectionModal"]) return;
            const target = event.target as HTMLInputElement;
            let username = target.value;
            // Truncate if too long
            if (username.length > gameConfig.usernameLength.max) {
                username = username.substring(0, gameConfig.usernameLength.max);
            }
            // Add random digits if too short
            if (username.length < gameConfig.usernameLength.min) {
                const chars = '0123456789';
                while (username.length < gameConfig.usernameLength.min) {
                    username += chars[Math.floor(Math.random() * chars.length)];
                }
            }
            memoryService.username = username;
            events.emit(EventProtocolEnum.SetUsernameValue, false, username);
        })) throw Error("ID does not exist.");

        // host online multiplayer gamemode button
        if (!addEventListener(this._document, "click", "onlineGameSelectHostMode", () => {
            if (!this._modalMemory["homeMenu"] || !this._modalMemory["onlineMultiplayerSelectionModal"]) return;
            events.emit(EventProtocolEnum.SelectMultiplayerModus, false, "Host");
            this.prepareShowingOfMenu(true);
            this._modalMemory["hostMultiplayerGameModal"] = true;
            getElementByIdAndSetDisplay(this._document, "hostMultiplayerGameModal", "block");
        })) throw Error("ID does not exist.");

        // join online multiplayer gamemode button
        if (!addEventListener(this._document, "click", "onlineGameSelectJoinMode", () => {
            if (!this._modalMemory["homeMenu"] || !this._modalMemory["onlineMultiplayerSelectionModal"]) return;
            events.emit(EventProtocolEnum.SelectMultiplayerModus, false, "Join");
            this.prepareShowingOfMenu(true);
            this._modalMemory["joinMultiplayerGameModal"] = true;
            getElementByIdAndSetDisplay(this._document, "joinMultiplayerGameModal", "block");
        })) throw Error("ID does not exist.");

        // campaign gamemode button
        if (!addEventListener(this._document, "click", "gamemodeSelectButtonCampaign", () => {
            if (!this._modalMemory["homeMenu"] || !this._modalMemory["homeModal"]) return;
            events.emit(events.advancedEventProtocol(EventProtocolEnum.SelectedGamemode, "Campaign"), false, "Campaign");
        })) throw Error("ID does not exist.");

        // offline multiplayer gamemode button
        if (!addEventListener(this._document, "click", "gamemodeSelectButtonMultiplayerOffline", () => {
            if (!this._modalMemory["homeMenu"] || !this._modalMemory["homeModal"]) return;
            events.emit(events.advancedEventProtocol(EventProtocolEnum.SelectedGamemode, "MultiplayerOffline"), false, "MultiplayerOffline");
        })) throw Error("ID does not exist.");

        // original gamemode button
        if (!addEventListener(this._document, "click", "gamemodeSelectButtonOriginal", () => {
            if (!this._modalMemory["homeMenu"] || !this._modalMemory["homeModal"]) return;
            events.emit(events.advancedEventProtocol(EventProtocolEnum.SelectedGamemode, "Original"), false, "Original");
        })) throw Error("ID does not exist.");

        // all back buttons rerouted to main menu
        if (!addQueryEventListeners(this._document, "click", ".backButton", () => {
            if (!this._modalMemory["homeMenu"]) return;
            events.emit(EventProtocolEnum.ShowHomeMenu, false, true);
            this.showHomeScreen(true);
        })) throw Error("Unknown error, investigate me!");

        // set the generated username.
        events.emit(EventProtocolEnum.SetUsernameValue, false, memoryService.username);
    }

    private setMobileOverlay(show: boolean = true) {
        getElementByIdAndSetDisplay(this._document, "mobileOverlay", show ? "flex" : "none");
    }

    private hideAllMenus(): void {
        MODALS.forEach(el => {
            this._modalMemory[el] = false;
            getElementByIdAndSetDisplay(this._document, el, "none");
        })
    }

    private prepareShowingOfMenu(show: boolean = true) {
        this.showAnyMenu(show);
        this.hideAllMenus();
    }

    private showAnyMenu(show: boolean = true) {
        this._modalMemory["homeMenu"] = show;
        getElementByIdAndSetDisplay(this._document, "homeMenu", show ? "block" : "none");
    }

    public showHomeScreen(show: boolean = true) {
        this.prepareShowingOfMenu(show);
        this._modalMemory["homeModal"] = show;
        getElementByIdAndSetDisplay(this._document, "homeModal", show ? "block" : "none");
    }

    public showConstructionScreen(show: boolean = true) {
        this.prepareShowingOfMenu(show);
        this._modalMemory["constructionModal"] = show;
        getElementByIdAndSetDisplay(this._document, "constructionModal", show ? "block" : "none");
    }
}