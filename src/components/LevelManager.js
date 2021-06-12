/**
 * @typedef {{id: Number, x: Number, z: Number, type: "floor" | "block" | "player" | "goal"}} LevelItem
 * @typedef {{data: LevelItem[], difficulty: String, id: Number}} Level
 */

import { Box3, CameraHelper, Scene, Vector3 } from "three";

import Config from "./Config";
import Block from "./Block";
import Floor from "./Floor";
import Player from "./Player";
import Goal from "./Goal";
import Sun from "./Sun";
import TextureLibrary from "./Library";

export default class LevelManager {
    /**
     * @param {Scene} scene 
     */
    constructor(scene) {
        this.scene = scene;

        /**
         * @type {{floors: Floor[], players: Player[], blocks: Block[], goals: Goal[], playersFalling: Player[], sun: Sun}}
         */

        this.objects = {
            floors: [],
            players: [],
            blocks: [],
            goals: [],
            playersFalling: [],
            sun: null
        };

        this.lengthX = null;
        this.lengthZ = null;

        this.countX = null;
        this.countZ = null;

        /**
         * @type {Vector3}
         */
        this.center = null;

        /**
         * @type {Level}
         */
        this.currentLevel = null;

        this.library = new TextureLibrary();
    }

    Update(){
        let tablToDel = []
        this.objects.players.forEach( e => {
            if(this.ShouldFall(e) && e.needMove == false){
                tablToDel.push(e);
            }
        })
        this.MakeFall(tablToDel);
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
        this.currentLevel = data;

        let p = new Promise((resolve, reject) => {
            let count = data.data.length;

            let size = Config.blockSize;

            let maxX = 0;
            let maxZ = 0;

            data.data.forEach(el => {
                switch (el.type) {
                    case "block": {
                        this._createFloor(el.x, el.z, size);
                        this._createBlock(el.x, el.z, size);

                        if (--count == 0) { resolve(); }
                        break;
                    }
                    case "floor": {
                        this._createFloor(el.x, el.z, size);

                        if (--count == 0) { resolve(); }
                        break;
                    }
                    case "player": {
                        this._createFloor(el.x, el.z, size);
                        this._createPlayer(el.x, el.z, size);

                        if (--count == 0) { resolve(); }
                        break;
                    }
                    case "goal": {
                        this._createGoal(el.x, el.z, size);

                        if (--count == 0) { resolve(); }
                        break;
                    }
                }

                if (el.x > maxX) { maxX = el.x; }
                if (el.z > maxZ) { maxZ = el.z; }
            });

            this.lengthX = (maxX + 1) * Config.blockSize;
            this.lengthZ = (maxZ + 1) * Config.blockSize;

            this.countX = maxX + 1;
            this.countZ = maxZ + 1;

            this.center = new Vector3(this.lengthX / 2, 0, this.lengthZ / 2);

            this.objects.sun = new Sun();

            let m = Math.min(this.lengthX, this.lengthZ);

            this.objects.sun.position.set(this.center.x, 1000, this.center.z + m);
            this.objects.sun.target.position.copy(this.center);
            this.scene.add(this.objects.sun);
            this.scene.add(this.objects.sun.target);
            // this.cameraHelper = new CameraHelper(this.objects.sun.shadow.camera)
            // this.scene.add(this.cameraHelper);
        });

        return p;
    }

    reset() {
        if (this.functionThatChecksIfThePlayerWonTheLevelByCheckingIfEveryGoalIsOccupiedByAPlayerEntity() === false) {
            this.empty();
            this.build(this.currentLevel);
        }
    }

    empty() {
        if (this.objects.sun) {
            this.scene.remove(this.objects.sun.target);
            // this.scene.remove(this.cameraHelper);
        }

        /**
         * @type {(Player|Goal|Floor|Block|Sun)[]}
         */
        let toRemove = []

        this.scene.traverse(object => {
            if (object instanceof Player ||
                object instanceof Goal ||
                object instanceof Floor ||
                object instanceof Block ||
                object instanceof Sun) {
                toRemove.push(object);
            }
        });

        toRemove.forEach(el => {
            this.scene.remove(el);
        });

        this.objects = {
            blocks: [],
            players: [],
            floors: [],
            goals: [],
            playersFalling: [],
            sun: null
        };
    }

    /**
     * @param {Number} x
     * @param {Number} z
     * @param {Number} size
     * @returns {Block}
     */
    _createBlock(x, z, size) {
        let block = new Block(x, z);

        //@ts-ignore
        let y = new Box3().setFromObject(block).getSize(new Vector3()).y;

        block.position.set(x * size + size / 2, y / 2, z * size + size / 2);

        this.scene.add(block);
        this.objects.blocks.push(block);

        return block;
    }

    /**
     * @param {Number} x
     * @param {Number} z
     * @param {Number} size
     * @returns {Floor}
     */
    _createFloor(x, z, size) {
        let floor = new Floor(x, z, this.library.materials.grassMaterial);
        floor.createOutline();

        //@ts-ignore
        let y = new Box3().setFromObject(floor).getSize(new Vector3()).y;

        floor.position.set(x * size + size / 2, -y / 2, z * size + size / 2);

        this.scene.add(floor);
        this.objects.floors.push(floor);

        return floor;
    }

    /**
     * @param {Number} x
     * @param {Number} z
     * @param {Number} size
     * @returns {Player}
     */
    _createPlayer(x, z, size) {
        let playerModels = {
            model: this.library.models.playerModel,
            idle: this.library.models.playerIdle,
            walk: this.library.models.playerWalk,
            fall: this.library.models.playerFall
        }
        let player = new Player(x, z, playerModels);

        //@ts-ignore
        let y = new Box3().setFromObject(player.model).getSize(new Vector3()).y;

        player.position.set(x * size + size / 2, y / 2 - 55, z * size + size / 2);

        this.scene.add(player);
        this.objects.players.push(player);

        return player;
    }

    /**
     * @param {Number} x
     * @param {Number} z
     * @param {Number} size
     * @returns {Goal}
     */
    _createGoal(x, z, size) {
        let goal = new Goal(x, z);
        goal.createOutline();

        //@ts-ignore
        let y = new Box3().setFromObject(goal).getSize(new Vector3()).y;

        goal.position.set(x * size + size / 2, -y / 2, z * size + size / 2);

        this.scene.add(goal);
        this.objects.goals.push(goal);

        return goal;
    }


    /**
     * @param {number} toX
     * @param {number} toZ
     */
    canMove(toX, toZ) {
        for (const block of this.objects.blocks) {
            if (block.x == toX && block.z == toZ) {
                return false;
            }
        }
        for (const player of this.objects.players) {
            if (player.x == toX && player.z == toZ) {
                return false;
            }
        }

        return true;
    }

    moveLeft() {
        this.objects.players.sort((a, b) => {
            return a.x - b.x
        });

        let tabToDel = [];

        for (const player of this.objects.players) {
            player.rotation.set(0, 3/2 * Math.PI, 0);
            if (this.canMove(player.x - 1, player.z)) {
                player.moveLeft();
            }
        }
    }

    moveRight() {
        this.objects.players.sort((a, b) => {
            return - (a.x - b.x)
        });

        let tabToDel = [];

        for (const player of this.objects.players) {
            player.rotation.set(0, 1/2 * Math.PI, 0);
            if (this.canMove(player.x + 1, player.z)) {
                player.moveRight();
            }
        }
    }
    
    moveUp() {
        this.objects.players.sort((a, b) => {
            return a.z - b.z
        });
        
        let tabToDel = [];
        
        for (const player of this.objects.players) {
            player.rotation.set(0, Math.PI, 0)
            if (this.canMove(player.x, player.z - 1)) {
                player.moveUp();
            }
        }
    }

    moveDown() {
        this.objects.players.sort((a, b) => {
            return - (a.z - b.z)
        });

        let tabToDel = [];

        for (const player of this.objects.players) {
            player.rotation.set(0, 0, 0)
            if (this.canMove(player.x, player.z + 1)) {
                player.moveDown();
            }
        }
    }

    /**
     * @param {Player} player
     */
    ShouldFall(player) {
        for (let floor of this.objects.floors) {
            if (floor.x == player.x && floor.z == player.z) {
                return false;
            }
        }

        for (let goal of this.objects.goals) {
            if (goal.x == player.x && goal.z == player.z) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param {Player[]} tab
     */
    MakeFall(tab) {
        for (let player of tab) {
            this.objects.players.splice(this.objects.players.indexOf(player), 1);
            this.objects.playersFalling.push(player);
            player.SetAction(player.animationActions['fall'])
        }
    }

    /**
     * @returns {Boolean}
     */
    functionThatChecksIfThePlayerWonTheLevelByCheckingIfEveryGoalIsOccupiedByAPlayerEntity() {
        if (this.objects.players.length !== this.objects.goals.length) {
            return false;
        }

        for (const player of this.objects.players) {
            let isOnGoal = false;

            for (const goal of this.objects.goals) {
                if (player.x == goal.x && player.z == goal.z && player.needMove == false) {
                    isOnGoal = true;
                }
            }

            if (isOnGoal == false) {
                return false;
            }
        }

        return true;
    }
}