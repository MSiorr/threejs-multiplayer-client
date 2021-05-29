import { BoxGeometry, Mesh, MeshPhongMaterial } from 'three';

import config from './Config';

export default class extends Mesh {
    /**
     * @param {number} x
     * @param {number} z
     */
    constructor(x, z) {
        super(
            new BoxGeometry(config.blockSize, config.blockSize, config.blockSize),
            new MeshPhongMaterial({
                color: 0x000000
            })
        )

        this.x = x;
        this.z = z;
    }
}