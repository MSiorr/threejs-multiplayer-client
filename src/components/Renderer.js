import { PCFSoftShadowMap, WebGLRenderer } from 'three';

export default class Renderer extends WebGLRenderer {
    /**
     * @param {HTMLDivElement} container 
     */
    constructor(container) {
        super({ antialias: true });

        this.container = container;

        this.setClearColor(0x888888);
        this.shadowMap.enabled = true;
        this.shadowMap.type = PCFSoftShadowMap;

        this.container.appendChild(this.domElement);

        this.updateSize();

        document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
        window.addEventListener('resize', () => this.updateSize(), false);
    }

    updateSize() {
        this.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * @param {THREE.Scene} scene
     * @param {THREE.Camera} camera
     */
    render(scene, camera) {
        this.render(scene, camera);
    }
}