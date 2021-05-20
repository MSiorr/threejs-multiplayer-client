import Player from "./Player";
import Config from './Config';

const KEYS = {
    "left": 'KeyA',
    "up": 'KeyW',
    "right": 'KeyD',
    "down": 'KeyS',
};

export default class {
    /**
     * @param {Window} domElement
     */    
    constructor(domElement){

        this.domElement = domElement;

        this.playersCanMove = true;

        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;

        this.domElement.addEventListener('keydown', event => this.OnKeyDown(event), false);
        // this.domElement.addEventListener('keyup', event => this.OnKeyUp(event), false);
    }

    /**
     * 
     * @param {KeyboardEvent} e 
     */
    OnKeyDown(e){
        if(this.playersCanMove == true){
            switch(e.code){
                case KEYS.up:
                    this.playersCanMove = false;
                    this.moveUp = true;
                    console.log("move up")
                    break;
                case KEYS.left:
                    this.playersCanMove = false;
                    this.moveLeft = true;
                    console.log("move left")
                    break;
                case KEYS.right:
                    this.playersCanMove = false;
                    this.moveRight = true;
                    console.log("move right")
                    break;
                case KEYS.down:
                    this.playersCanMove = false;
                    this.moveDown = true;
                    console.log("move down")
                    break;
            }
        }
    }
}