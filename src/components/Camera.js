import { PerspectiveCamera } from 'three';
import Renderer from './Renderer.js';

export default class Camera extends PerspectiveCamera {

    /**
     * @param {number} fov 
     * @param {Renderer} renderer 
     */
    constructor(fov, renderer) {
        const width = renderer.domElement.width;
        const height = renderer.domElement.height;

        super(fov, width / height);

        this.updateSize(renderer);
        this.far = 50000;

        window.addEventListener('resize', () => this.updateSize(renderer), false);
    }

    /**
     * @param {Renderer} renderer
     */
    updateSize(renderer) {
        this.aspect = renderer.domElement.width / renderer.domElement.height;
        this.updateProjectionMatrix();
    }
}