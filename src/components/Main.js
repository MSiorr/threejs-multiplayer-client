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

        const gridHelper = new GridHelper(1000, 100);
        this.scene.add(gridHelper);

        this.axisHelper = new AxesHelper(10000);
        this.scene.add(this.axisHelper);

        this.camera.position.set(1000, 1000, 1000);
        this.camera.lookAt(0, 0, 0);

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
                        this.render();
                    })
            })
    }

    render() {
        this.stats.begin()

        this.renderer.render(this.scene, this.camera);

        this.stats.end()

        requestAnimationFrame(this.render.bind(this));
    }
}