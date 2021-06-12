import { BoxGeometry, Mesh, MeshPhongMaterial, Object3D } from 'three';

import config from './Config';

export default class Block extends Object3D {
    /**
     * @param {number} x
     * @param {number} z
     * @param {Mesh} mesh
     */
    constructor(x, z, mesh) {
        // super(
        //     new BoxGeometry(config.blockSize, config.blockSize / 3, config.blockSize),
        //     new MeshPhongMaterial({
        //         color: 0x444444
        //     })
        // )
        super()

        this.castShadow = true;
        this.receiveShadow = true;

        this.x = x;
        this.z = z;

        this.rock = mesh.clone();
        this.rock.position.set(0, 0, 0);
        this.add(this.rock);
    }
}