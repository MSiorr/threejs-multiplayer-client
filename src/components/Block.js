import { BoxGeometry, Mesh, MeshPhongMaterial } from 'three';

import config from './Config';

export default class Block extends Mesh {
    /**
     * @param {number} x
     * @param {number} z
     */
    constructor(x, z) {
        super(
            new BoxGeometry(config.blockSize, config.blockSize / 3, config.blockSize),
            new MeshPhongMaterial({
                color: 0x444444
            })
        )

        this.castShadow = true;
        this.receiveShadow = true;

        this.x = x;
        this.z = z;
    }
}