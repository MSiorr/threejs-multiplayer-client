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
                        if(this.objectsArray[x-1][z] == null){
                            this.objectsArray[x][z].Move(-1, 0);
                        }
                    }
                }
            }
            keyboard.moveLeft = false;
            keyboard.playersCanMove = true;
        }
        else if(keyboard.moveUp){
            for(let i = 0; i < this.objectsArray.length; i++){
                for(let j = 0; j < this.objectsArray[i].length; j++){
                    if(this.objectsArray[i][j] instanceof Player){
                        if(this.objectsArray[i-1][j] == null){
                            this.objectsArray[i][j].Move(0, -1);
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
                        if(this.objectsArray[x-1][z] == null){
                            this.objectsArray[x][z].Move(1, 0);
                        }
                    }
                }
            }
            keyboard.moveRight = false;
            keyboard.playersCanMove = true;
        }
        else if(keyboard.moveDown){

        }
    }
}