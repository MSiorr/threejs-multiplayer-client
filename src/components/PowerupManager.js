/**
 * @typedef {{
 * "inverted_keyboard": PowerupItem,
 * "camera_shake": PowerupItem,
 * "camera_rotation": PowerupItem,
 * }} Powerups
 */

import PowerupItem from "./PowerupItem";

export default class PowerupManager {
    constructor() {
        /**
         * @type {Powerups}
         */
        this.powerups = {
            "inverted_keyboard": new PowerupItem("inverted_keyboard", null, 1),
            "camera_shake": new PowerupItem("camera_shake", null, 2),
            "camera_rotation": new PowerupItem("camera_rotation", null, 3),
        };

        /**
         * @type {{[key in keyof Powerups]: Boolean}}
         */
        //@ts-ignore
        this.states = {};

        let keys = Object.keys(this.powerups);
        keys.forEach((key) => {
            this.states[key] = false;
        });
    }

    get tier1() {
        const arr = Object.entries(this.powerups);
        const tier1 = arr.filter(([key, value]) => value.tier === 1);

        return Object.fromEntries(tier1);
    }

    get tier2() {
        const arr = Object.entries(this.powerups);
        const tier1 = arr.filter(([key, value]) => value.tier === 2);

        return Object.fromEntries(tier1);
    }

    get tier3() {
        const arr = Object.entries(this.powerups);
        const tier1 = arr.filter(([key, value]) => value.tier === 3);

        return Object.fromEntries(tier1);
    }
}