import Floor from "./Floor";
import Goal from "./Goal";
import Keyboard from "./Keyboard";
import Player from "./Player";

export default class{
    constructor(){
        this.size = null;
        this.groundArray = [];  
        this.objectsArray = [];  
    }

    Create(size){
        this.size = size;

        for(let i = 0; i < this.size; i++){
            this.groundArray[i] = [];
            this.objectsArray[i] = [];
            for(let j = 0; j < this.size; j++){
                this.groundArray[i][j] = null;
                this.objectsArray[i][j] = null;
            }
        }
    }

    /**
     * 
     * @param {Keyboard} keyboard 
     */
    Update(keyboard){
        if(keyboard.moveLeft){
            for(let x = 0; x < this.objectsArray.length; x++){
                for(let z = 0; z < this.objectsArray[x].length; z++){
                    if(this.objectsArray[x][z] instanceof Player){
                        if(this.objectsArray[x-1][z] == null && (this.groundArray[x-1][z] instanceof Floor || this.groundArray[x-1][z] instanceof Goal)){
                            this.objectsArray[x][z].Move(-1, 0);
                            this.objectsArray[x-1][z] = this.objectsArray[x][z];
                            this.objectsArray[x][z] = null;
                        }
                    }
                }
            }
            keyboard.moveLeft = false;
            keyboard.playersCanMove = true;
        }
        else if(keyboard.moveUp){
            for(let z = 0; z < this.objectsArray[0].length; z++){
                for(let x = 0; x < this.objectsArray[z].length; x++){
                    if(this.objectsArray[x][z] instanceof Player){
                        if(this.objectsArray[x][z-1] == null && (this.groundArray[x][z-1] instanceof Floor || this.groundArray[x][z-1] instanceof Goal)){
                            this.objectsArray[x][z].Move(0, -1);
                            this.objectsArray[x][z-1] = this.objectsArray[x][z];
                            this.objectsArray[x][z] = null;
                        }
                    }
                }
            }
            keyboard.moveUp = false;
            keyboard.playersCanMove = true;
        }
        else if(keyboard.moveRight){
            for(let x = this.objectsArray.length-1; x >= 0; x--){
                for(let z = 0; z < this.objectsArray[x].length; z++){
                    if(this.objectsArray[x][z] instanceof Player){
                        if(this.objectsArray[x+1][z] == null && (this.groundArray[x+1][z] instanceof Floor || this.groundArray[x+1][z] instanceof Goal)){
                            this.objectsArray[x][z].Move(1, 0);
                            this.objectsArray[x+1][z] = this.objectsArray[x][z];
                            this.objectsArray[x][z] = null;
                        }
                    }
                }
            }
            keyboard.moveRight = false;
            keyboard.playersCanMove = true;
        }
        else if(keyboard.moveDown){
            for(let z = this.objectsArray[0].length - 1; z >= 0 ; z--){
                for(let x = 0; x < this.objectsArray[z].length; x++){
                    if(this.objectsArray[x][z] instanceof Player){
                        if(this.objectsArray[x][z+1] == null && (this.groundArray[x][z+1] instanceof Floor || this.groundArray[x][z+1] instanceof Goal)){
                            this.objectsArray[x][z].Move(0, 1);
                            this.objectsArray[x][z+1] = this.objectsArray[x][z];
                            this.objectsArray[x][z] = null;
                        }
                    }
                }
            }
            keyboard.moveDown = false;
            keyboard.playersCanMove = true;
        }
    }
}