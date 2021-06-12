import { PCFSoftShadowMap, WebGLRenderer } from 'three';

export default class Renderer extends WebGLRenderer {
    /**
     * @param {HTMLDivElement} container 
     */
    constructor(container, lobby = false) {
        super({ antialias: true, alpha: true });

        this.container = container;

        if(lobby == true){
            this.setClearColor(0x000000, 0);
        } else {
            this.setClearColor(0x87ceeb, 1);
        }
        this.shadowMap.enabled = true;
        this.shadowMap.type = PCFSoftShadowMap;

        this.container.appendChild(this.domElement);

        this.updateSize();

        document.addEventListener('DOMContentLoaded', () => this.updateSize(), false);
        window.addEventListener('resize', () => this.updateSize(), false);
    }

    updateSize() {
        // let bbox = this.container.getBoundingClientRect();

        // this.setSize(bbox.width, bbox.height);
        this.setSize(innerWidth, innerHeight);
    }

    /**
     * @param {THREE.Scene} scene
     * @param {THREE.Camera} camera
     */
    render(scene, camera) {
        this.render(scene, camera);
    }
}