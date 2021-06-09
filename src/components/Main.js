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

        this.socket = new Socket();
        this.socket.Add("room_assigned", this.EnterRoom.bind(this));
        this.socket.Add("config", this.ReceiveConfig.bind(this));
        this.socket.Add("forfeit", this.EnemyForfeit.bind(this));
        this.socket.Add("new_level", this.NewLevel.bind(this));
        this.socket.Add("wait", this.WaitForNextMap.bind(this));
        this.socket.Add("win", this.WinBattle.bind(this));
        this.socket.Add("lose", this.LoseBattle.bind(this));
        this.socket.Add("powerup_target", this.PowerupTarget.bind(this));

        this.playerCompleteCurrentLevel = false;

        this.playerMovementRule = [true];

        this.camera.position.set(500, 2000, 500);
        this.camera.lookAt(500, 0, 500);
        this.camera.far = 4096;
        this.camera.updateProjectionMatrix();

        this.stats = Stats();
        this.stats.showPanel(0);

        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.lookAt(500, 0, 500);

        document.body.appendChild(this.stats.dom);

        this.levelManager.load(`https://${Config.hostname}/level/1`)
            .then(response => response.json())
            .then(data => {
                this.levelManager.build(data)
                    .then(() => {
                        this.inputManager = new InputManager(this.playerMovementRule);
                        this.inputManager.RegisterEventCapture();
                        this.inputManager.Add("left", this.levelManager.moveLeft.bind(this.levelManager), ["KeyA"], false);
                        this.inputManager.Add("right", this.levelManager.moveRight.bind(this.levelManager), ["KeyD"], false);
                        this.inputManager.Add("up", this.levelManager.moveUp.bind(this.levelManager), ["KeyW"], false);
                        this.inputManager.Add("down", this.levelManager.moveDown.bind(this.levelManager), ["KeyS"], false);

                        this.sun = new Sun();

                        let m = Math.min(this.levelManager.lengthX, this.levelManager.lengthZ);

                        this.sun.position.set(this.levelManager.center.x, 1000, this.levelManager.center.z + m);
                        this.sun.target.position.copy(this.levelManager.center);
                        this.scene.add(this.sun);
                        this.scene.add(this.sun.target);
                        this.cameraHelper = new CameraHelper(this.sun.shadow.camera)
                        this.scene.add(this.cameraHelper);

                        this.render();
                    })
            })
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

        let v = Utility.rotateVectorAroundPoint(this.sun.position, this.levelManager.center, new Euler(0, Math.PI / 72000, 0));
        this.sun.position.copy(v);

        this.renderer.render(this.scene, this.camera);

        this.stats.end()

        requestAnimationFrame(this.render.bind(this));
    }

    /**
     * @param {String} data
     */
    EnterRoom(data) {
        console.log("SERVER FOUND ROOM FOR U");
    }

    /**
     * @param {any} data 
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
     * @param {any} data
     */
    NewLevel(data) {
        console.log("U GOTTA NEW LEVEL BRO");
        console.log(data);
    }

    WaitForNextMap() {
        console.log("U WAIT FOR NEXT MAP");
    }

    WinBattle() {
        console.log("YOU WIN MY FRIEND");
    }

    LoseBattle() {
        console.log("YOU LOSE MY FRIEND");
    }

    /**
     * @param {{name: String}} data 
     */
    PowerupTarget(data) {
        console.log("ENEMY USE POWERUP ON U");
    }
}