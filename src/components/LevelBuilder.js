/**
 * @typedef {{id: Number, x: Number, y: Number, z: Number, type: "floor" | "block" | "player" | "goal"}} LevelItem
 * @typedef {{data: LevelItem[], size: Number}} Level
 */

import Config from "./Config";

import Block from "./Block";
import Floor from "./Floor";
import Player from "./Player";
import Goal from "./Goal";

export default class LevelBuilder {
    /**
     * @param {THREE.Scene} scene 
     */
    constructor(scene) {
        this.scene = scene;

        /**
         * @type {{floors: Floor[], players: Player[], blocks: Block[], goals: Goal[]}}
         */

        this.objects = {
            floors: [],
            players: [],
            blocks: [],
            goals: [],
        };
    }

    /**
     * @param {String} url 
     * @returns {Promise<Response>}
     */
    load(url) {
        return fetch(url, { method: "GET" })
    }

    /**
     * @param {Level} data 
     */
    build(data) {
        let p = new Promise((resolve, reject) => {
            let count = data.data.length;

            let fullSize = Config.blockSize;
            let halfSize = Config.blockSize / 2;

            data.data.forEach(el => {
                switch (el.type) {
                    case "block": {
                        let block = new Block();

                        block.position.set(el.x * fullSize + halfSize, el.y * fullSize + halfSize, el.z * fullSize + halfSize);

                        this.scene.add(block);
                        this.objects.blocks.push(block);

                        if (--count == 0) { resolve(); }
                        break;
                    }
                    case "floor": {
                        let floor = new Floor();

                        floor.position.set(el.x * fullSize + halfSize, el.y * fullSize + halfSize, el.z * fullSize + halfSize);

                        this.scene.add(floor);
                        this.objects.floors.push(floor);

                        if (--count == 0) { resolve(); }
                        break;
                    }
                    case "player": {
                        let player = new Player();

                        player.position.set(el.x * fullSize + halfSize, el.y * fullSize + halfSize, el.z * fullSize + halfSize);

                        this.scene.add(player);
                        this.objects.players.push(player);

                        if (--count == 0) { resolve(); }
                        break;
                    }
                    case "goal": {
                        let goal = new Goal();

                        goal.position.set(el.x * fullSize + halfSize, el.y * fullSize + halfSize, el.z * fullSize + halfSize);

                        this.scene.add(goal);
                        this.objects.goals.push(goal);

                        if (--count == 0) { resolve(); }
                        break;
                    }
                }
            });
        });

        return p;
    }

    empty() {
        this.scene.traverse(object => {
            this.scene.remove(object);
        });

        this.objects = {
            blocks: [],
            players: [],
            floors: [],
            goals: [],
        };
    }
}