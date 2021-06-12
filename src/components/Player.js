import { AnimationAction, AnimationMixer, BoxGeometry, Mesh, MeshPhongMaterial, Object3D, Skeleton } from 'three';
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";

import config from './Config';
import InputManager from './InputManager';
import LevelManager from './LevelManager';

export default class Player extends Object3D {
    /**
     * @param {Number} x
     * @param {Number} z
     * @param {{model: Mesh, idle: Mesh}} modelObj
     */
    constructor(x, z, modelObj) {
        super()
        this.model = this.CloneModel(modelObj.model);
        this.add(this.model);
        this.model.position.set(0, 0, 0);

        this.velocity = config.playerVelocity;

        this.x = x;
        this.z = z;
        this.toX = x * config.blockSize + config.blockSize / 2;
        this.toZ = z * config.blockSize + config.blockSize / 2;

        this.needMove = false;

        this.fallingVelocity = 0;
        this.fallingVelocityCap = 30;
        this.fallingVelocityIncrement = 0.6;

        this.mixer = new AnimationMixer(this.model);
        this.animationActions = {

        };
        for (let anim in modelObj) {
            if (anim != 'model') {
                console.log(modelObj[anim]);
                let action = this.mixer.clipAction(modelObj[anim].animations[0]);
                this.animationActions[anim] = action;
            }
        }
        this.activeAction = null;
        this.lastAction = null;
        this.SetAction(this.animationActions['idle']);

        this.moveBtn = null;
    }

    /**
     * @param {number} delta
     * @param {InputManager} inputManager
     */
    Update(delta, inputManager) {
        if (this.mixer) this.mixer.update(delta)

        // console.log(this.needMove);
        if (this.needMove) {
            // if(this.position.x != this.toX){
            //     this.position.x += Math.sign(this.toX - this.position.x) * Math.min(Math.abs(this.toX - this.position.x), this.velocity * delta);
            // } else if(this.position.z != this.toZ){
            //     this.position.z += Math.sign(this.toZ - this.position.z) * Math.min(Math.abs(this.toZ - this.position.z), this.velocity * delta);
            // }

            let currentVel = this.velocity * delta;

            switch (this.moveBtn) {
                case 'left': {
                    this.position.x += -1 * Math.min(Math.abs(this.toX - this.position.x), currentVel);
                    break;
                }
                case 'up': {
                    this.position.z += -1 * Math.min(Math.abs(this.toZ - this.position.z), currentVel);
                    break;
                }
                case 'right': {
                    this.position.x += Math.min(Math.abs(this.toX - this.position.x), currentVel);
                    break;
                }
                case 'down': {
                    this.position.z += Math.min(Math.abs(this.toZ - this.position.z), currentVel);
                    break;
                }
            }

            // if(this.inputManager.rules['left'].task !== null)

            if (this.toX == this.position.x && this.toZ == this.position.z) {
                this.needMove = false;
                this.moveBtn = null;
                this.SetAction(this.animationActions['idle']);
            }
        }
    }

    /**
     * @param {AnimationAction} toAction 
     */
    SetAction(toAction) {
        if (this.activeAction != toAction) {
            this.lastAction = this.activeAction;
            this.activeAction = toAction;
            if (this.lastAction != null) {
                this.lastAction.fadeOut(.1);
            }
            this.activeAction.reset();
            this.activeAction.fadeIn(.1);
            this.activeAction.play();
        }
    }

    moveUp() {
        this.z = this.z - 1;

        this.toZ = this.z * config.blockSize + config.blockSize / 2;
        // this.position.set(this.position.x, this.position.y, this.z * config.blockSize + config.blockSize / 2);
        this.needMove = true;
        this.moveBtn = 'up';
        this.SetAction(this.animationActions['walk'])
    }

    moveLeft() {
        this.x = this.x - 1;

        this.toX = this.x * config.blockSize + config.blockSize / 2;
        // this.position.set(this.x * config.blockSize + config.blockSize / 2, this.position.y, this.position.z);
        this.needMove = true;
        this.moveBtn = 'left';
        this.SetAction(this.animationActions['walk'])
    }

    moveDown() {
        this.z = this.z + 1;

        this.toZ = this.z * config.blockSize + config.blockSize / 2;
        // this.position.set(this.position.x, this.position.y, this.z * config.blockSize + config.blockSize / 2);
        this.needMove = true;
        this.moveBtn = 'down';
        this.SetAction(this.animationActions['walk'])
    }

    moveRight() {
        this.x = this.x + 1;

        this.toX = this.x * config.blockSize + config.blockSize / 2;
        // this.position.set(this.x * config.blockSize + config.blockSize / 2, this.position.y, this.position.z);
        this.needMove = true;
        this.moveBtn = 'right';
        this.SetAction(this.animationActions['walk'])
    }

    fall() {
        this.fallingVelocity = Math.min(this.fallingVelocity + this.fallingVelocityIncrement, this.fallingVelocityCap);
        this.position.y -= this.fallingVelocity;
    }

    /**
     * @param {Mesh} model 
     */
    CloneModel(model) {
        let clone = SkeletonUtils.clone(model);
        clone.animations = model.animations;

        return clone;
    }
}