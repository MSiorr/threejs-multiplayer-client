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
import LevelBuilder from "./LevelBuilder";
import Keyboard from './Keyboard';

export default class Main {
    /**
     * @param {HTMLDivElement} container 
     */
    constructor(container) {
        this.container = container;
        this.scene = new Scene();
        this.renderer = new Renderer(container);
        this.camera = new Camera(75, this.renderer);
        this.levelBuilder = new LevelBuilder(this.scene);

        const gridHelper = new GridHelper(3000, 30, 0xff0000, 0x0000ff);
        this.scene.add(gridHelper);

        this.camera.position.set(1000, 1000, 1000);
        this.camera.lookAt(0, 0, 0);
        this.camera.far = 10000;
        this.camera.updateProjectionMatrix();

        this.ambientLight = new AmbientLight(0xffffff, 1);
        this.scene.add(this.ambientLight);

        this.stats = Stats();
        this.stats.showPanel(0);

        const controls = new OrbitControls(this.camera, this.renderer.domElement);

        document.body.appendChild(this.stats.dom);

        this.levelBuilder.load("https://progetto-stefanetto.herokuapp.com/level")
            .then(response => response.json())
            .then(data => {
                this.levelBuilder.build(data)
                    .then(() => {
                        this.keyboard = new Keyboard(window);
                        console.log(this.levelBuilder.levelData.objectsArray);
                        this.render();
                    })
            })
    }

    render() {
        this.stats.begin()

        this.renderer.render(this.scene, this.camera);

        this.levelBuilder.levelData.Update(this.keyboard);

        this.stats.end()

        requestAnimationFrame(this.render.bind(this));
    }
}