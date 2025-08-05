import {
    addEventListener,
    addQueryEventListeners,
    getElementByIdAndSetDisplay,
    getElementByIdAndSetInnerHTML,
    getInputElementByIdAndSetValue,
    setCheckboxCheckedById
} from "../helpers/HtmlHelpers.ts";
import {events} from "../services/EventService.ts";
import {EventProtocolEnum} from "../types/enum/EventProtocol.enum.ts";
import {SystemLogic} from "./SystemLogic.ts";
import {LobbyInfoInterface, LobbySettingsInterface, memoryService} from "../services/MemoryService.ts";
import {gameConfig} from "../types/dto_interface/GameConfig.interface.ts";
import {getRandomAlphaNumString} from "../helpers/RandomisationHelper.ts";

const MODALS = ["constructionModal", "homeModal", "onlineMultiplayerSelectionModal", "joinMultiplayerGameModal", "hostMultiplayerGameModal"];

export class HtmlRenderer extends SystemLogic {
    private _document: Document;
    private _modalMemory: { [id: string] : boolean; } = {};
    private _accordionMemory: { [id: string] : boolean; } = {};

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
        let hostMultiplayerMethod = () => {
            if (!this._modalMemory["homeMenu"] || (!this._modalMemory["onlineMultiplayerSelectionModal"] && !this._modalMemory["joinMultiplayerGameModal"])) return;
            events.emit(EventProtocolEnum.SelectMultiplayerModus, false, "Host");
            this.prepareShowingOfMenu(true);
            this._modalMemory["hostMultiplayerGameModal"] = true;
            memoryService.isHostedGame = true;
            const LOBBY_DISCOVERABLE_BY_DEFAULT = true;
            memoryService.setLobby({
                isActive: true, lobbyIdentifier: getRandomAlphaNumString(5),
                discoverable: LOBBY_DISCOVERABLE_BY_DEFAULT, discoverableLobbyIdentifier: getRandomAlphaNumString(10),
                players: 1, playing: false
            });
            events.emit(EventProtocolEnum.HostLobby, false, memoryService.getLobby());
            if (!setCheckboxCheckedById(this._document, "discoverySetting", LOBBY_DISCOVERABLE_BY_DEFAULT)) throw Error("Lobby host id element not defined.")
            if (!getElementByIdAndSetInnerHTML(this._document, "lobbyHostId", memoryService.getLobby().lobbyIdentifier)) throw Error("Lobby host id element not defined.");
            getElementByIdAndSetDisplay(this._document, "hostMultiplayerGameModal", "block");
        }
        if (!addEventListener(this._document, "click", "onlineGameSelectHostMode", hostMultiplayerMethod)) throw Error("onlineGameSelectHostMode does not exist.");
        if (!addEventListener(this._document, "click", "onlineGameSelectHostMode2", hostMultiplayerMethod)) throw Error("onlineGameSelectHostMode2 does not exist.");

        // online discovery checkbox
        if (!addEventListener(this._document, "change", "discoverySetting", (event: Event) => {
            if (!this._modalMemory["homeMenu"] || !this._modalMemory["hostMultiplayerGameModal"]) return;
            const target = event.target as HTMLInputElement;
            let value = target.checked;
            this._logger.LogInfo(`${value}`);
            const lobby: LobbySettingsInterface = memoryService.getLobby();
            lobby.discoverable = value;
            memoryService.setLobby(lobby);
            events.emit(EventProtocolEnum.HostLobby, false, memoryService.getLobby());
        })) throw Error("discoverySetting does not exist.");

        let showLobbyMenuMethod = () => {
            const discovery: LobbyInfoInterface[] = memoryService.getDiscovery();
            if (discovery.length === 0) {
                if (!getElementByIdAndSetDisplay(this._document, "onlineGameSelectHostMode2", "block"))
                    throw Error("joinMultiplayerGameModal does not exist.");
                if (!getElementByIdAndSetInnerHTML(
                    this._document,
                    "gameLobbiesBox",
                    `<div class="alert alert-warning" role="alert">
                <h3>No Open Lobbies</h3>
                <p>Wow, such empty.</p>
                <sub>Try hosting a lobby yourself.</sub>
            </div>`
                )) throw Error("gameLobbiesBox does not exist.");
                return;
            }

            if (!getElementByIdAndSetDisplay(this._document, "onlineGameSelectHostMode2", "none"))
                throw Error("joinMultiplayerGameModal does not exist.");

            let lobbyNumber = 0;
            let innerHtml = "";
            for (const key of Object.keys(this._accordionMemory)) {
                if (!discovery.some((element: LobbyInfoInterface): boolean => element.identifier === key)) {
                    delete this._accordionMemory[key];
                }
            }

            discovery.forEach((element: LobbyInfoInterface): void => {
                if (this._accordionMemory[element.identifier] == undefined) {
                    this._accordionMemory[element.identifier] = false;
                }
                const collapseId = `collapse_${lobbyNumber}`;
                // const buttonId = `button_${lobbyNumber}`;
                innerHtml += `
            <div class="accordion" id="accordion_${lobbyNumber}">
                <div class="accordion-item">
                    <h2 class="accordion-header" id="heading_${lobbyNumber}">
                        <button 
                            class="accordion-button ${this._accordionMemory[element.identifier] ? "" : "collapsed"}" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target="#${collapseId}" 
                            aria-expanded="${this._accordionMemory[element.identifier] ? "true" : "false"}" 
                            aria-controls="${collapseId}">
                            ${element.username} (${element.players}/2)
                        </button>
                    </h2>
                    <div 
                        id="${collapseId}" 
                        class="accordion-collapse collapse ${this._accordionMemory[element.identifier] ? "show" : ""}" 
                        data-lobby-number="${element.identifier}"
                        aria-labelledby="heading_${lobbyNumber}">
                        <div class="accordion-body">
                            Host: ${element.username}<br>
                            Players: ${element.players}/2<br>
                            ID: ${element.identifier} <button type="button" class="btn btn-link p-0 ms-2 info-trigger" aria-label="Info"
          data-title="Lobby ID" data-body="This ID is shared over MQTT, which makes it discoverable. This is not the same ID as seen on the host their screen. The ID shared over MQTT is only usable when the host sets the lobby as dicoverable, whereas the ID on their screen is always usable." data-time="Just now">
    <i class="bi bi-info-circle"></i>
  </button><br><br/>
                            <button id="joinLobby_${lobbyNumber}" class="btn btn-primary">Join</button>
                        </div>
                    </div>
                </div>
            </div>
            <br/>
        `;
                lobbyNumber++;
            });

            if (!getElementByIdAndSetInnerHTML(this._document, "gameLobbiesBox", innerHtml))
                throw Error("gameLobbiesBox does not exist.");
        }

        events.subscribe(EventProtocolEnum.RefreshHtmlUI, this, showLobbyMenuMethod);

        const lobbiesContainer = this._document.getElementById("gameLobbiesBox");
        const onShown = (e: Event) => {
            const target = e.target as HTMLElement; // the `.accordion-collapse` that was shown
            if (target.classList.contains("accordion-collapse")) {
                const lobbyNum: string | undefined = target.dataset.lobbyNumber;
                if (lobbyNum == undefined) return;
                this._accordionMemory[lobbyNum] = true;
            }
        };
        const onHidden = (e: Event) => {
            const target = e.target as HTMLElement;
            if (target.classList.contains("accordion-collapse")) {
                const lobbyNum: string | undefined = target.dataset.lobbyNumber;
                if (lobbyNum == undefined) return;
                this._accordionMemory[lobbyNum] = false;
            }
        };
        lobbiesContainer?.addEventListener("shown.bs.collapse", onShown as EventListener);
        lobbiesContainer?.addEventListener("hidden.bs.collapse", onHidden as EventListener);

        // join online multiplayer gamemode button
        if (!addEventListener(this._document, "click", "onlineGameSelectJoinMode", (): void => {
            if (!this._modalMemory["homeMenu"] || !this._modalMemory["onlineMultiplayerSelectionModal"]) return;
            events.emit(EventProtocolEnum.SelectMultiplayerModus, false, "Join");
            memoryService.isHostedGame = false;
            this.prepareShowingOfMenu(true);
            this._modalMemory["joinMultiplayerGameModal"] = true;
            if (!getElementByIdAndSetDisplay(this._document, "joinMultiplayerGameModal", "block")) throw Error("joinMultiplayerGameModal does not exist.");
            if (!getElementByIdAndSetInnerHTML(this._document, "gameLobbiesBox", "")) throw Error("gameLobbiesBox does not exist.");
            showLobbyMenuMethod();

        })) throw Error("ID does not exist.");

        // campaign gamemode button
        if (!addEventListener(this._document, "click", "gamemodeSelectButtonCampaign", (): void => {
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
            if (this._modalMemory["hostMultiplayerGameModal"]) {
                events.emit(EventProtocolEnum.CloseLobby, false, memoryService.getLobby());
                memoryService.setLobby({
                    isActive: false,
                    lobbyIdentifier: '',
                    discoverable: false,
                    discoverableLobbyIdentifier: '',
                    players: 1,
                    playing: false
                });
            }
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