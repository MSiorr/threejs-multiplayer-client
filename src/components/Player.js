import { BoxGeometry, Mesh, MeshPhongMaterial } from 'three';

import config from './Config';

export default class Player extends Mesh {
    /**
     * @param {Number} x
     * @param {Number} z
     */
    constructor(x, z) {
        super(
            new BoxGeometry(3 * config.blockSize / 4, 3 * config.blockSize / 4, 3 * config.blockSize / 4),
            new MeshPhongMaterial({
                color: 0xff2222
            })
        )

        this.castShadow = true;
        this.receiveShadow = true;

        this.x = x;
        this.z = z;
        this.fallingVelocity = 0;
        this.fallingVelocityCap = 30;
        this.fallingVelocityIncrement = 0.6;
    }

    moveUp() {
        this.z = this.z - 1;

        this.position.set(this.position.x, this.position.y, this.z * config.blockSize + config.blockSize / 2);
    }

    moveLeft() {
        this.x = this.x - 1;

        this.position.set(this.x * config.blockSize + config.blockSize / 2, this.position.y, this.position.z);
    }

    moveDown() {
        this.z = this.z + 1;

        this.position.set(this.position.x, this.position.y, this.z * config.blockSize + config.blockSize / 2);
    }

    moveRight() {
        this.x = this.x + 1;

        this.position.set(this.x * config.blockSize + config.blockSize / 2, this.position.y, this.position.z);
    }

    fall() {
        this.fallingVelocity = Math.min(this.fallingVelocity + this.fallingVelocityIncrement, this.fallingVelocityCap);
        this.position.y -= this.fallingVelocity;
    }
}