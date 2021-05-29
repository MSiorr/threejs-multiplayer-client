import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import {
    Scene,
    GridHelper,
    AmbientLight,
    AxesHelper
} from 'three';

import Renderer from './Renderer';
import Camera from './Camera';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import LevelBuilder from "./LevelManager";
import Keyboard from './Keyboard';
import InputManager from './InputManager';

export default class Main {
    /**
     * @param {HTMLDivElement} container 
     */
    constructor(container) {
        this.container = container;
        this.scene = new Scene();
        this.renderer = new Renderer(container);
        this.camera = new Camera(75, this.renderer);
        this.levelManager = new LevelBuilder(this.scene);

        const gridHelper = new GridHelper(3000, 30, 0xff0000, 0x0000ff);
        this.scene.add(gridHelper);

        this.camera.position.set(1000, 1000, 1000);
        this.camera.lookAt(0, 0, 0);
        this.camera.far = 100000;
        this.camera.updateProjectionMatrix();

        this.ambientLight = new AmbientLight(0xffffff, 1);
        this.scene.add(this.ambientLight);

        this.stats = Stats();
        this.stats.showPanel(0);

        const controls = new OrbitControls(this.camera, this.renderer.domElement);

        document.body.appendChild(this.stats.dom);

        this.levelManager.load("https://progetto-stefanetto.herokuapp.com/level")
            .then(response => response.json())
            .then(data => {
                this.levelManager.build(data)
                    .then(() => {
                        this.inputManager = new InputManager([true]);
                        this.inputManager.RegisterEventCapture();
                        this.inputManager.Add("left", this.levelManager.moveLeft.bind(this.levelManager), ["KeyA"], false);
                        this.inputManager.Add("right", this.levelManager.moveRight.bind(this.levelManager), ["KeyD"], false);
                        this.inputManager.Add("up", this.levelManager.moveUp.bind(this.levelManager), ["KeyW"], false);
                        this.inputManager.Add("down", this.levelManager.moveDown.bind(this.levelManager), ["KeyS"], false);

                        this.render();
                    })
            })
    }

    render() {
        this.stats.begin()

        // if (this.keyboard.moveLeft) { this.levelManager.moveLeft(); this.keyboard.moveLeft = false; this.keyboard.playersCanMove = true; }
        // if (this.keyboard.moveRight) { this.levelManager.moveRight(); this.keyboard.moveRight = false; this.keyboard.playersCanMove = true; }
        // if (this.keyboard.moveUp) { this.levelManager.moveUp(); this.keyboard.moveUp = false; this.keyboard.playersCanMove = true; }
        // if (this.keyboard.moveDown) { this.levelManager.moveDown(); this.keyboard.moveDown = false; this.keyboard.playersCanMove = true; }

        for (const player of this.levelManager.objects.playersFalling) {
            player.fall();
        }

        if (this.levelManager.functionThatChecksIfThePlayerWonTheLevelByCheckingIfEveryGoalIsOccupiedByAPlayerEntity()) {
            console.log("Bravo");
        }

        this.renderer.render(this.scene, this.camera);

        this.stats.end()

        requestAnimationFrame(this.render.bind(this));
    }
}