/**
 * @typedef {{
 * "inverted_keyboard": PowerupItem,
 * "slow_movement": PowerupItem,
 * "switch_goal_to_floor": PowerupItem,
 * "camera_shake": PowerupItem,
 * "dark_screen": PowerupItem,
 * "invisible_player": PowerupItem,
 * "camera_rotation": PowerupItem,
 * "random_holes": PowerupItem,
 * "reset_level": PowerupItem,
 * }} Powerups
 */

import PowerupItem from "./PowerupItem";

import inverted_keyboard from "../resources/icons/powerups/inverted_keyboard.png";
import slow_movement from "../resources/icons/powerups/slow_movement.png";
import switch_goal_to_floor from "../resources/icons/powerups/switch_goal_to_floor.png";

import camera_shake from "../resources/icons/powerups/camera_shake.png";
import dark_screen from "../resources/icons/powerups/dark_screen.png";
import invisible_player from "../resources/icons/powerups/invisible_player.png";

import camera_rotation from "../resources/icons/powerups/camera_rotation.png";
import random_holes from "../resources/icons/powerups/random_holes.png";
import reset_level from "../resources/icons/powerups/reset_level.png";

export default class PowerupManager {
    constructor() {
        /**
         * @type {Powerups}
         */
        this.powerups = {
            "inverted_keyboard": new PowerupItem("inverted_keyboard", inverted_keyboard, 1, 3, 15, this.onUse.bind(this), this.globalCooldown.bind(this)),
            "slow_movement": new PowerupItem("slow_movement", slow_movement, 1, 3, 15, this.onUse.bind(this), this.globalCooldown.bind(this)),
            "switch_goal_to_floor": new PowerupItem("switch_goal_to_floor", switch_goal_to_floor, 1, 3, 15, this.onUse.bind(this), this.globalCooldown.bind(this)),

            "camera_shake": new PowerupItem("camera_shake", camera_shake, 2, 6, 15, this.onUse.bind(this), this.globalCooldown.bind(this)),
            "dark_screen": new PowerupItem("dark_screen", dark_screen, 2, 6, 15, this.onUse.bind(this), this.globalCooldown.bind(this)),
            "invisible_player": new PowerupItem("invisible_player", invisible_player, 2, 6, 15, this.onUse.bind(this), this.globalCooldown.bind(this)),

            "camera_rotation": new PowerupItem("camera_rotation", camera_rotation, 3, 9, 15, this.onUse.bind(this), this.globalCooldown.bind(this)),
            "random_holes": new PowerupItem("random_holes", random_holes, 3, 9, 15, this.onUse.bind(this), this.globalCooldown.bind(this)),
            "reset_level": new PowerupItem("reset_level", reset_level, 3, 9, 5, this.onUse.bind(this), this.globalCooldown.bind(this)),
        };

        /**
         * @type {{[key in keyof Powerups]: Boolean}}
         */
        this.states = {
            "inverted_keyboard": false,
            "slow_movement": false,
            "switch_goal_to_floor": false,

            "camera_shake": false,
            "dark_screen": false,
            "invisible_player": false,

            "camera_rotation": false,
            "random_holes": false,
            "reset_level": false,
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
        this.lightIntensity = 1;

        this.randomHolesActivated = false;
        this.switchGoalToFloorActivated = false;
        this.invisiblePlayerActivated = false;
        this.resetLevelActivated = false;

        this.globalCooldownTime = 5000;
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
     * @param {Boolean} reset
     * @param {keyof Powerups} not
     * @returns {PowerupManager}
     */
    randomPowerup(tier, reset = false, not = null) {
        let t = `tier${tier}`;
        let keys = Object.keys(this[t]);

        if (not !== null) {
            keys.splice(keys.indexOf(not), 1);
        }

        this.current[t] = this[t][keys[Math.floor(keys.length * Math.random())]]

        if (reset) {
            this.current[t].reset();
        }

        return this;
    }

    /**
     * @param {PowerupItem} powerup 
     */
    onUse(powerup) {
        powerup.nextActive = Date.now();

        this.randomPowerup(powerup.tier, true, powerup.name);
    }

    globalCooldown() {
        /**
         * @type {"tier1" | "tier2" | "tier3"}
         */
        let tier;
        for (tier in this.current) {
            let p = this.current[tier];

            p.nextActive = Math.max(Date.now() + this.globalCooldownTime, p.nextActive);
        }
    }

    resetPowerupVariables() {
        this.randomHolesActivated = false;
        this.switchGoalToFloorActivated = false;
        this.invisiblePlayerActivated = false;
        this.resetLevelActivated = false;
    }
}