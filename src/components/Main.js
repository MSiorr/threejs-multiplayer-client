import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import {
    Scene,
    GridHelper,
    AmbientLight,
    AxesHelper,
    Vector3,
    Euler,
    CameraHelper,
    DirectionalLightHelper
} from 'three';

import Renderer from './Renderer';
import Camera from './Camera';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import LevelManager from "./LevelManager";
import InputManager from './InputManager';
import Sun from './Sun';
import Utility from './Utility';
import Socket from './Socket';
import Config from './Config';
import Menu from './Menu';
import GUI from './GUI';

export default class Main {
    /**
     * @param {HTMLDivElement} container 
     */
    constructor(container) {
        this.container = container;
        this.scene = new Scene();
        this.renderer = new Renderer(container);
        this.camera = new Camera(75, this.renderer);
        this.levelManager = new LevelManager(this.scene);

        this.menu = new Menu();
        this.menu.show("title");
        this.menu.html.startGame.addEventListener("click", this.startSearch.bind(this));

        this.gui = new GUI();
        this.gui.showAll();

        this.socket = null;

        this.playerCompleteCurrentLevel = false;

        this.playerMovementRule = [false];

        this.camera.position.set(500, 1000, 500);
        this.camera.lookAt(500, 0, 500);
        this.camera.far = 4096;
        this.camera.updateProjectionMatrix();

        this.stats = Stats();
        this.stats.showPanel(0);

        // const controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.camera.lookAt(500, 0, 500);

        document.body.appendChild(this.stats.dom);

        this.inputManager = new InputManager(this.playerMovementRule);
        this.inputManager.RegisterEventCapture();
        this.inputManager.Add("left", this.levelManager.moveLeft.bind(this.levelManager), ["KeyA"], false);
        this.inputManager.Add("right", this.levelManager.moveRight.bind(this.levelManager), ["KeyD"], false);
        this.inputManager.Add("up", this.levelManager.moveUp.bind(this.levelManager), ["KeyW"], false);
        this.inputManager.Add("down", this.levelManager.moveDown.bind(this.levelManager), ["KeyS"], false);
        this.inputManager.Add("reset", this.levelManager.reset.bind(this.levelManager), ["KeyR"], false);
    }

    render() {
        this.stats.begin()

        for (const player of this.levelManager.objects.playersFalling) {
            player.fall();
        }

        if (this.levelManager.functionThatChecksIfThePlayerWonTheLevelByCheckingIfEveryGoalIsOccupiedByAPlayerEntity()) {
            if (this.playerCompleteCurrentLevel == false) {
                this.playerCompleteCurrentLevel = true;
                this.playerMovementRule[0] = false;
                console.log("LEVEL IS DONE");

                this.socket.Send(this.socket.createMessage("done"));

            }
        }

        if (this.levelManager.objects.sun) {
            let v = Utility.rotateVectorAroundPoint(this.levelManager.objects.sun.position, this.levelManager.center, new Euler(0, Math.PI / 72000, 0));
            this.levelManager.objects.sun.position.copy(v);
        }

        this.renderer.render(this.scene, this.camera);

        this.stats.end()

        this.animationFrame = requestAnimationFrame(this.render.bind(this));
    }

    startSearch() {
        this.menu.hide("title");
        this.menu.show("lobby");

        this.socket = new Socket();

        this.socket.Add("room_assigned", this.EnterRoom.bind(this));
        this.socket.Add("config", this.ReceiveConfig.bind(this));
        this.socket.Add("forfeit", this.EnemyForfeit.bind(this));
        this.socket.Add("new_level", this.NewLevel.bind(this));
        this.socket.Add("wait", this.WaitForNextMap.bind(this));
        this.socket.Add("win", this.WinBattle.bind(this));
        this.socket.Add("lose", this.LoseBattle.bind(this));
        this.socket.Add("powerup_target", this.PowerupTarget.bind(this));
    }

    /**
     * @param {String} data
     */
    EnterRoom(data) {
        console.log("SERVER FOUND ROOM FOR U");
        this.menu.hide("lobby");
        this.menu.show("startsSoon");
        this.menu.edit("startsSoon", "Get ready... </br>Game will begin shortly");
    }

    /**
     * @param {String} data
     */
    ReceiveConfig(data) {
        console.log("U RECEIVE NEW CONFIG");
        console.log(data);
    }

    /**
     * @param {String} data
     */
    EnemyForfeit(data) {
        console.log("YOUR ENEMY WAS NOOB AND HE HAS GONE AWAY BLYEAT :D");
    }

    /**
     * @param {String} data
     */
    NewLevel(data) {
        console.log("U GOTTA NEW LEVEL BRO");

        cancelAnimationFrame(this.animationFrame);

        this.currentLevel = data;

        this.levelManager.empty();
        this.levelManager.build(JSON.parse(data))
            .then(() => {
                this.menu.hide("startsSoon");
                this.menu.hide("roomTransition");

                this.gui.showAll();

                this.camera.position.set(this.levelManager.center.x, 1000, this.levelManager.lengthZ * 1.2);
                this.camera.lookAt(this.levelManager.center);

                this.playerMovementRule[0] = true;
                this.playerCompleteCurrentLevel = false;

                this.render();
            })
    }

    WaitForNextMap() {
        console.log("U WAIT FOR NEXT MAP");

        this.menu.show("roomTransition");
    }

    WinBattle() {
        console.log("YOU WIN MY FRIEND");

        this.menu.hide("roomTransition");
        this.menu.show("win");

        this.playerMovementRule[0] = false;
        cancelAnimationFrame(this.animationFrame);
    }

    LoseBattle() {
        console.log("YOU LOSE MY FRIEND");

        this.menu.hide("roomTransition");
        this.menu.show("lose");

        this.playerMovementRule[0] = false;
        cancelAnimationFrame(this.animationFrame);
    }

    /**
     * @param {{name: String}} data 
     */
    PowerupTarget(data) {
        console.log("ENEMY USE POWERUP ON U");
    }
}