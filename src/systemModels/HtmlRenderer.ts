import {addEventListener, addQueryEventListeners, getElementByIdAndSetDisplay} from "../helpers/HtmlHelpers.ts";
import {events} from "./EventHandler.ts";
import {EventProtocolEnum} from "../types/enum/EventProtocol.enum.ts";
import {GameObject} from "./GameObject.ts";

const MODALS = ["constructionModal", "homeModal", "onlineMultiplayerSelectionModal", "joinMultiplayerGameModal", "hostMultiplayerGameModal"];

export class HtmlRenderer extends GameObject{
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

        // online multiplayer gamemode button
        if (!addEventListener(this._document, "click", "gamemodeSelectButtonMultiplayerOnline", () => {
            if (!this._modalMemory["homeMenu"] || !this._modalMemory["homeModal"]) return;
            events.emit(events.advancedEventProtocol(EventProtocolEnum.SelectedGamemode, "MultiplayerOnline"), false, "MultiplayerOnline");
            this.prepareShowingOfMenu(true);
            this._modalMemory["onlineMultiplayerSelectionModal"] = true;
            getElementByIdAndSetDisplay(this._document, "onlineMultiplayerSelectionModal", "block");
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

    }

    private setMobileOverlay(show: boolean = true) {
        getElementByIdAndSetDisplay(this._document, "mobileOverlay", show ? "block" : "none");
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