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
 * powerupTier1: HTMLElement,
 * powerupTier2: HTMLElement,
 * powerupTier3: HTMLElement,
 * gameInfo: gameInfoElements
 * }} GUIElements
 */

import Utility from "./Utility";
import PowerupItem from "./PowerupItem";
import Socket from "./Socket";

export default class GUI {
    constructor() {

        /**
         * @type {Socket}
         */
        this.socket = null;

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
            powerupTier1: null,
            powerupTier2: null,
            powerupTier3: null,
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

        /**
         * @type {{tier1: PowerupItem, tier2: PowerupItem, tier3: PowerupItem}}
         */
        this.powerups = null;

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

        //@ts-ignore
        this.html.powerupTier1 = document.getElementById("powerup-tier-1");
        //@ts-ignore
        this.html.powerupTier2 = document.getElementById("powerup-tier-2");
        //@ts-ignore
        this.html.powerupTier3 = document.getElementById("powerup-tier-3");

        this.html.powerupTier1.addEventListener("click", () => { this.usePowerup(1); });
        this.html.powerupTier2.addEventListener("click", () => { this.usePowerup(2); });
        this.html.powerupTier3.addEventListener("click", () => { this.usePowerup(3); });

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

    renderPowerups() {
        this.html.powerupTier1.style.backgroundImage = `url("${this.powerups["tier1"].path}")`;
        this.html.powerupTier2.style.backgroundImage = `url("${this.powerups["tier2"].path}")`;
        this.html.powerupTier3.style.backgroundImage = `url("${this.powerups["tier3"].path}")`;

        ["1", "2", "3"].forEach(n => {
            let t = this.powerups[`tier${n}`].nextActive;
            let d = Utility.clamp(t - Date.now(), 0, Number.MAX_SAFE_INTEGER);

            if (d === 0) {
                this.html[`powerupTier${n}`].classList.remove("cooldown");
            } else {
                this.html[`powerupTier${n}`].classList.add("cooldown");
                this.html[`powerupTier${n}`].dataset["time"] = `${(d / 1000).toFixed(1)}`
            }
        });
    }


    /**
     * @param {number} n
     */
    usePowerup(n) {
        let t = this.powerups[`tier${n}`].nextActive;
        let d = Utility.clamp(t - Date.now(), 0, Number.MAX_SAFE_INTEGER);

        if (d === 0) {
            this.powerups[`tier${n}`].use();
            let m = this.socket.createMessage("powerup_use", JSON.stringify({ name: this.powerups[`tier${n}`].name }));
            this.socket.Send(m);
        }
    }
}