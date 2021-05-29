import { BoxGeometry, Mesh, MeshPhongMaterial } from 'three';

import config from './Config';

export default class extends Mesh {
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

        this.x = x;
        this.z = z;
        this.shouldFall = false;
    }

    // /**
    //  * @param {number} x
    //  * @param {number} z
    //  */
    // Move(x,z){

    //     console.log("MOOOVE")

    //     let newX = this.position.x + x * config.blockSize;
    //     let newZ = this.position.z + z * config.blockSize;

    //     this.position.set(newX, this.position.y, newZ);
    // }

    moveUp() {
        console.log("Move up")
        this.z = this.z - 1;

        this.position.set(this.position.x, this.position.y, this.z * config.blockSize + config.blockSize / 2);
    }

    moveLeft() {
        console.log("Move left")
        this.x = this.x - 1;

        this.position.set(this.x * config.blockSize + config.blockSize / 2, this.position.y, this.position.z);

        console.log(this.position);
    }

    moveDown() {
        console.log("Move down")
        this.z = this.z + 1;

        this.position.set(this.position.x, this.position.y, this.z * config.blockSize + config.blockSize / 2);
    }

    moveRight() {
        console.log("Move right")
        this.x = this.x + 1;

        this.position.set(this.x * config.blockSize + config.blockSize / 2, this.position.y, this.position.z);
    }

    fall() {
        this.position.y -= 1;
    }
}