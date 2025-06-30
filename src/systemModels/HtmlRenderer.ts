import {getElementByIdAndSetDisplay} from "../helpers/HtmlHelpers.ts";
import {events} from "./EventHandler.ts";
import {EventProtocolEnum} from "../types/enum/EventProtocol.enum.ts";
import {GameObject} from "./GameObject.ts";

const MODALS = ["constructionModal", "homeModal", "onlineMultiplayerSelectionModal", "joinMultiplayerGameModal", "hostMultiplayerGameModal"];

export class HtmlRenderer extends GameObject{
    private _document: Document;
    constructor(document: Document) {
        super();
        this._document = document;
    }

    onInit() {
        events.subscribe(EventProtocolEnum.ShowMobileOverlay, this, (data) => {
            if (typeof data.value === typeof true) {
                this.setMobileOverlay(data.value);
            } else {
                this._logger.LogDebug(`Received Event with Protocol ${EventProtocolEnum.ShowMobileOverlay} and the value is: ${data.value}`)
            }
        });
    }

    private setMobileOverlay(show: boolean = true) {
        getElementByIdAndSetDisplay(this._document, "mobileOverlay", show ? "block" : "none");
    }

    private hideAllMenus(): void {
        MODALS.forEach(el => {
            getElementByIdAndSetDisplay(this._document, el, "none");
        })
    }

    private prepareShowingOfMenu(show: boolean = true) {
        this.showAnyMenu(show);
        this.hideAllMenus();
    }

    private showAnyMenu(show: boolean = true) {
        getElementByIdAndSetDisplay(this._document, "homeMenu", show ? "block" : "none");
    }

    public showHomeScreen(show: boolean = true) {
        this.prepareShowingOfMenu(show);
        getElementByIdAndSetDisplay(this._document, "homeModal", show ? "block" : "none");
    }

    public showConstructionScreen(show: boolean = true) {
        this.prepareShowingOfMenu(show);
        getElementByIdAndSetDisplay(this._document, "constructionModal", show ? "block" : "none");
    }
}