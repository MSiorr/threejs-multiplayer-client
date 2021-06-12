import { AnimationMixer, BoxGeometry, Mesh, MeshPhongMaterial } from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';


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

        this.mixer = null;
        this.animationActions = [];
        this.activeAction = null;
        this.lastAction = null;
    }

    Load(){
        const loader = new FBXLoader();

            loader.load("../models/player.fbx", (object) => {

                this.mixer = new AnimationMixer(object);
                console.log("animacje modelu",object.animations)

                const action = this.mixer.clipAction(object.animations[0]);
                this.animationActions.push(action);
                this.activeAction = this.animationActions[0];
                action.play();

                this.model = object
            });
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