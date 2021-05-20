import { BoxGeometry, Mesh, MeshPhongMaterial } from 'three';

import config from './Config';

export default class extends Mesh{
    constructor(){
        super(
            new BoxGeometry(config.blockSize / 2, config.blockSize / 2, config.blockSize / 2),
            new MeshPhongMaterial({
                color: 0xff2222
            })
        )
    }
}