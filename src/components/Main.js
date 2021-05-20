import {
    AxesHelper,
    Clock,
    Scene,
    Vector3,
} from 'three';

import Renderer from './Renderer';
import Camera from './Camera';
import Stats from 'three/examples/jsm/libs/stats.module.js';

export default class Main {
    /**
     * @param {HTMLDivElement} container 
     */
    constructor(container) {
        this.container = container;
        this.scene = new Scene();
        this.renderer = new Renderer(container);
        this.camera = new Camera(75, this.renderer);

        // const gridHelper = new GridHelper(1000, 10);
        // this.scene.add(gridHelper);

        this.stats = Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb

        document.body.appendChild(this.stats.dom);

        this.render();
    }

    render() {
        this.stats.begin()

        this.renderer.render(this.scene, this.camera);

        this.stats.end()

        requestAnimationFrame(this.render.bind(this));
    }
}