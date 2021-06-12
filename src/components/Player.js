import { AnimationAction, AnimationMixer, BoxGeometry, Mesh, MeshPhongMaterial, Object3D, Skeleton } from 'three';
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";

import config from './Config';

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

        this.model.castShadow = true;
        this.model.receiveShadow = true;
        this.model.position.set(0,0,0);

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
        for(let anim in modelObj){
            if(anim != 'model'){
                console.log(modelObj[anim]);
                let action = this.mixer.clipAction(modelObj[anim].animations[0]);
                this.animationActions[anim] = action;
            }
        }
        this.activeAction = null;
        this.lastAction = null;
        this.SetAction(this.animationActions['idle']);
    }

    /**
     * @param {number} delta
     */
    Update(delta){
        if (this.mixer) this.mixer.update(delta)

        if(this.needMove){

        }
    }

    /**
     * @param {AnimationAction} toAction 
     */
    SetAction(toAction) {
        if(this.activeAction != toAction){
            this.lastAction = this.activeAction;
            this.activeAction = toAction;
            if(this.lastAction != null){
                this.lastAction.fadeOut(.5);
            }
            this.activeAction.reset();
            this.activeAction.fadeIn(.5);
            this.activeAction.play();
        }
    }

    moveUp() {
        this.z = this.z - 1;

        // this.toZ = this.z * config.blockSize + config.blockSize / 2;
        this.position.set(this.position.x, this.position.y, this.z * config.blockSize + config.blockSize / 2);
        this.rotation.set(0, Math.PI, 0)
        this.needMove = true;
    }
    
    moveLeft() {
        this.x = this.x - 1;
        
        // this.toX = this.x * config.blockSize + config.blockSize / 2;
        this.position.set(this.x * config.blockSize + config.blockSize / 2, this.position.y, this.position.z);
        this.rotation.set(0, 3/2 * Math.PI, 0)
        this.needMove = true;
    }
    
    moveDown() {
        this.z = this.z + 1;
        
        // this.toZ = this.z * config.blockSize + config.blockSize / 2;
        this.position.set(this.position.x, this.position.y, this.z * config.blockSize + config.blockSize / 2);
        this.rotation.set(0, 0, 0)
        this.needMove = true;
    }
    
    moveRight() {
        this.x = this.x + 1;
        
        // this.toX = this.x * config.blockSize + config.blockSize / 2;
        this.position.set(this.x * config.blockSize + config.blockSize / 2, this.position.y, this.position.z);
        this.rotation.set(0, 1/2 * Math.PI, 0)
        this.needMove = true;
    }

    fall() {
        this.fallingVelocity = Math.min(this.fallingVelocity + this.fallingVelocityIncrement, this.fallingVelocityCap);
        this.position.y -= this.fallingVelocity;
    }

    /**
     * @param {Mesh} model 
     */
    CloneModel(model){
        let clone = SkeletonUtils.clone(model);
        clone.animations = model.animations;

        return clone;
    }
}