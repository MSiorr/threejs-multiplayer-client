import { ACESFilmicToneMapping, CineonToneMapping, LinearToneMapping, PCFSoftShadowMap, ReinhardToneMapping, WebGLRenderer } from 'three';

export default class Renderer extends WebGLRenderer {
    /**
     * @param {HTMLDivElement} container 
     */
    constructor(container, lobby = false) {
        super({ antialias: true, alpha: true });

        this.container = container;

        this.setClearColor(0x87ceeb, 1);

        this.shadowMap.enabled = true;
        this.shadowMap.type = PCFSoftShadowMap;
        this.localClippingEnabled = true;
        // this.toneMapping = LinearToneMapping;
        // this.toneMapping = ReinhardToneMapping;
        // this.toneMapping = CineonToneMapping;
        if (lobby === false) {
            this.toneMapping = ACESFilmicToneMapping;
            this.toneMappingExposure = 1;
        } else {
            this.toneMapping = ACESFilmicToneMapping;
            this.toneMappingExposure = 0.7;
        }

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