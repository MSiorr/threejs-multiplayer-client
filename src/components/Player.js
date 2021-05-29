import { BoxGeometry, Mesh, MeshPhongMaterial } from 'three';

import config from './Config';

export default class extends Mesh {
    /**
     * @param {Number} [x]
     * @param {Number} [z]
     */
    constructor(x,z) {
        super(
            new BoxGeometry(3 * config.blockSize / 4, 3 * config.blockSize / 4, 3 * config.blockSize / 4),
            new MeshPhongMaterial({
                color: 0xff2222
            })
        )
        this.x = x;
        this.z = z;
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

    MoveUp(){
        console.log("Move up")
        this.z = this.z - 1;
        
        this.position.set(this.position.x, this.position.y, this.z * config.blockSize);
    }

    MoveLeft(){
        console.log("Move left")
        this.x = this.x - 1;
        
        this.position.set(this.x * config.blockSize, this.position.y, this.position.z);
    }

    MoveDown(){
        console.log("Move down")
        this.z = this.z + 1;
        
        this.position.set(this.position.x, this.position.y, this.z * config.blockSize);
    }

    MoveRight(){
        console.log("Move right")
        this.x = this.x + 1;
        
        this.position.set(this.x * config.blockSize, this.position.y, this.position.z);
    }

}