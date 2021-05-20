import { BoxGeometry, Mesh, MeshPhongMaterial } from 'three';

import config from './Config';

export default class extends Mesh {
    constructor() {
        super(
            new BoxGeometry(3 * config.blockSize / 4, 3 * config.blockSize / 4, 3 * config.blockSize / 4),
            new MeshPhongMaterial({
                color: 0xff2222
            })
        )
    }
}