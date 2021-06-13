/**
 * @typedef {{
 * "inverted_keyboard": PowerupItem,
 * "camera_shake": PowerupItem,
 * "camera_rotation": PowerupItem,
 * }} Powerups
 */

import PowerupItem from "./PowerupItem";

import inverted_keyboard from "../resources/icons/powerups/inverted_keyboard.png";
import camera_shake from "../resources/icons/powerups/camera_shake.png";
import camera_rotation from "../resources/icons/powerups/camera_rotation.png";

export default class PowerupManager {
    constructor() {
        /**
         * @type {Powerups}
         */
        this.powerups = {
            "inverted_keyboard": new PowerupItem("inverted_keyboard", inverted_keyboard, 1, 30),
            "camera_shake": new PowerupItem("camera_shake", camera_shake, 2, 60),
            "camera_rotation": new PowerupItem("camera_rotation", camera_rotation, 3, 90),
        };

        /**
         * @type {{[key in keyof Powerups]: Boolean}}
         */
        this.states = {
            "camera_rotation": false,
            "camera_shake": false,
            "inverted_keyboard": false,
        };

        /**
         * @type {{tier1: PowerupItem, tier2: PowerupItem, tier3: PowerupItem}}
         */
        this.current = {
            tier1: null,
            tier2: null,
            tier3: null
        }

        this.cameraRotation = 0;
    }

    get tier1() {
        const arr = Object.entries(this.powerups);
        const tier1 = arr.filter(([_, value]) => value.tier === 1);

        return Object.fromEntries(tier1);
    }

    get tier2() {
        const arr = Object.entries(this.powerups);
        const tier1 = arr.filter(([_, value]) => value.tier === 2);

        return Object.fromEntries(tier1);
    }

    get tier3() {
        const arr = Object.entries(this.powerups);
        const tier1 = arr.filter(([_, value]) => value.tier === 3);

        return Object.fromEntries(tier1);
    }

    /**
     * @param {1 | 2 | 3} tier
     * @returns {PowerupManager}
     */
    randomPowerup(tier) {
        let t = `tier${tier}`;
        this.current[t] = this[t][Object.keys(this[t])[Math.floor(Object.keys(this[t]).length * Math.random())]]

        return this;
    }
}