/**
 * @typedef {{
 * main: HTMLElement, 
 * enemy: HTMLElement, 
 * player: HTMLElement
 * }} statusElements
 * 
 * @typedef {{
 * main: HTMLElement, 
 * mapCount: HTMLElement, 
 * easyMapCount: HTMLElement, 
 * mediumMapCount: HTMLElement, 
 * hardMapCount: HTMLElement, 
 * currentMapCount: HTMLElement, 
 * currentMapDifficulty: HTMLElement, 
 * time: HTMLElement
 * }} gameInfoElements
 * 
 * @typedef {{
 * statusBars: statusElements,
 * options: HTMLElement,
 * activeEffects: HTMLElement,
 * powerups: HTMLElement,
 * gameInfo: gameInfoElements
 * }} GUIElements
 */

export default class GUI {
    constructor() {

        /**
         * @type {GUIElements}
         */
        this.html = {
            statusBars: {
                main: null,
                enemy: null,
                player: null
            },
            options: null,
            activeEffects: null,
            powerups: null,
            gameInfo: {
                main: null,
                mapCount: null,
                easyMapCount: null,
                mediumMapCount: null,
                hardMapCount: null,
                currentMapCount: null,
                currentMapDifficulty: null,
                time: null
            }
        }

        this.powerupTier1 = null;
        this.powerupTier2 = null;
        this.powerupTier3 = null;

        this.totalLevels = 0;
        this.maxPoints = null;
        this.currentMap = 0;
        /**
         * @type {String | null}
         */
        this.currentMapDifficulty = null;

        this.initHTML();
    }

    initHTML() {
        this.html.statusBars.main = document.getElementById("status-bars");
        this.html.statusBars.player = document.getElementById("player-bar");
        this.html.statusBars.enemy = document.getElementById("enemy-bar");

        this.html.options = document.getElementById("options");
        this.html.activeEffects = document.getElementById("active-effects");
        this.html.powerups = document.getElementById("powerups");

        this.html.gameInfo.main = document.getElementById("game-info");
        this.html.gameInfo.mapCount = document.getElementById("map-count");
        this.html.gameInfo.easyMapCount = document.getElementById("easy-map-count");
        this.html.gameInfo.mediumMapCount = document.getElementById("medium-map-count");
        this.html.gameInfo.hardMapCount = document.getElementById("hard-map-count");
        this.html.gameInfo.currentMapCount = document.getElementById("current-map-count");
        this.html.gameInfo.currentMapDifficulty = document.getElementById("current-map-difficulty");
        this.html.gameInfo.time = document.getElementById("time");
    }

    /**
     * @param {keyof(GUIElements) } element 
     * @param {keyof(statusElements) | keyof(gameInfoElements) | null} innerElement
     */
    show(element, innerElement = null) {
        if (innerElement == null) {
            // @ts-ignore
            this.html[element].classList.add("active");
        } else {
            this.html[element][innerElement].classList.add("active");
        }
    }

    /**
     * @param {keyof(GUIElements) } element 
     * @param {keyof(statusElements) | keyof(gameInfoElements) | null} innerElement
     */
    hide(element, innerElement) {
        if (innerElement == null) {
            // @ts-ignore
            this.html[element].classList.remove("active");
        } else {
            this.html[element][innerElement].classList.remove("active");
        }
    }

    showAll() {
        this.html.options.classList.add("active");
        this.html.activeEffects.classList.add("active");
        this.html.powerups.classList.add("active");

        this.html.statusBars.main.classList.add("active");
        this.html.gameInfo.main.classList.add("active");
    }

    hideAll() {
        this.html.options.classList.remove("active");
        this.html.activeEffects.classList.remove("active");
        this.html.powerups.classList.remove("active");

        this.html.statusBars.main.classList.remove("active");
        this.html.gameInfo.main.classList.remove("active");
    }

    /**
     * @param {String} content
     * @param {keyof(GUIElements) } element 
     * @param {keyof(statusElements) | keyof(gameInfoElements) | null} innerElement
     */
    edit(content, element, innerElement) {
        if (innerElement == null) {
            // @ts-ignore
            this.html[element].innerHTML = content;
        } else {
            this.html[element][innerElement].innerHTML = content;
        }
    }
}