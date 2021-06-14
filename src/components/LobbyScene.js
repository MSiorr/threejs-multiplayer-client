import { AmbientLight, AxesHelper, Clock, Scene, Vector3 } from "three";
import Camera from "./Camera";
import Renderer from "./Renderer";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Library from "./Library";
import Player from "./Player";
import { SkeletonUtils } from "three/examples/jsm/utils/SkeletonUtils";
import Sun from "./Sun";

export default class LobbyScene {
    /**
     * @param {HTMLElement} container
     * @param {Library} library
     */
    constructor(container, library){
        this.container = container;
        this.library = library;

        this.scene = new Scene();
        // @ts-ignore
        this.renderer = new Renderer(this.container, true);
        this.camera = new Camera(75, this.renderer);

        this.camera.position.set(220,120,0);
        this.camera.lookAt(new Vector3(0,120,0));
        this.camera.updateProjectionMatrix();

        this.myCameraTarget = {
            x: 220,
            y: 120,
            z: 0
        }

        this.myCameraMove = false;
        this.myCameraRotate = false;

        this.myCameraSpeed = 200;
        this.myCameraLookAt = new Vector3(0, 120, 0);

        this.newCameraLookAt = new Vector3(0, 120, 0);

        // let fastAxes = new AxesHelper(500);
        // this.scene.add(fastAxes);

        this.sun = new Sun();
        this.sun.intensity = 2;
        this.sun.position.set(200, 500, 0);
        this.sun.target.position.set(0,0,0);

        this.scene.add(this.sun);
        this.scene.add(this.sun.target);

        this.sunToCastle1 = new Sun();
        this.sunToCastle1.intensity = 1;
        this.sunToCastle1.position.set(-800, 500, 0);
        this.sunToCastle1.target.position.set(-1000, 0, 1200);

        this.scene.add(this.sunToCastle1);
        this.scene.add(this.sunToCastle1.target);

        this.sunToCastle2 = new Sun();
        this.sunToCastle2.intensity = 1;
        this.sunToCastle2.position.set(-800, 500, 0);
        this.sunToCastle2.target.position.set(-1000, 0, -1200);

        this.scene.add(this.sunToCastle2);
        this.scene.add(this.sunToCastle2.target);

        // this.ambientLight = new AmbientLight(0xffffff, 3);
        // this.scene.add(this.ambientLight);

        /**
         * @type {Player[]}
         */
        this.players = [];
        /**
         * @type {Player[]}
         */
        this.playerWarriors = [];
        /**
         * @type {Player[]}
         */
        this.enemyWarriors = []

        this.clock = new Clock();

        this.myPlayerStatus = 'bored';
        this.enemyPlayerStatus = 'ready';

        // const controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.Hide();
        this.render();
    }

    render(){
        this.renderer.render(this.scene, this.camera);

        let delta = this.clock.getDelta();

        this.players.forEach( player => {
            player.Update(delta)
        })

        if(this.camera){
            if(this.camera.position.x == this.myCameraTarget.x && this.camera.position.y == this.myCameraTarget.y && this.camera.position.z == this.myCameraTarget.z){
                this.myCameraMove = false;
            } else {
                this.myCameraMove = true;
            }
        }
        if(this.myCameraMove == true){
            let target = new Vector3(this.myCameraTarget.x, this.myCameraTarget.y, this.myCameraTarget.z).sub(this.camera.position).normalize();
            this.camera.position.x += Math.sign(this.myCameraTarget.x - this.camera.position.x) * Math.min(Math.abs(this.myCameraTarget.x - this.camera.position.x), this.myCameraSpeed * delta * Math.abs(target.x));
            this.camera.position.y += Math.sign(this.myCameraTarget.y - this.camera.position.y) * Math.min(Math.abs(this.myCameraTarget.y - this.camera.position.y), this.myCameraSpeed * delta * Math.abs(target.y));
            this.camera.position.z += Math.sign(this.myCameraTarget.z - this.camera.position.z) * Math.min(Math.abs(this.myCameraTarget.z - this.camera.position.z), this.myCameraSpeed * delta * Math.abs(target.z)) ;
        }
        if(this.camera){
            if(this.myCameraLookAt.x == this.newCameraLookAt.x && this.myCameraLookAt.y == this.newCameraLookAt.y && this.myCameraLookAt.z == this.newCameraLookAt.z){
                this.myCameraRotate = false;
            } else {
                this.myCameraRotate = true;
            }
        }
        if(this.myCameraRotate == true){
            let target = new Vector3(this.newCameraLookAt.x, this.newCameraLookAt.y, this.newCameraLookAt.z).sub(this.myCameraLookAt).normalize();
            this.myCameraLookAt.x += Math.sign(this.newCameraLookAt.x - this.myCameraLookAt.x) * Math.min(Math.abs(this.newCameraLookAt.x - this.myCameraLookAt.x), this.myCameraSpeed * delta * Math.abs(target.x));
            this.myCameraLookAt.y += Math.sign(this.newCameraLookAt.y - this.myCameraLookAt.y) * Math.min(Math.abs(this.newCameraLookAt.y - this.myCameraLookAt.y), this.myCameraSpeed * delta * Math.abs(target.y));
            this.myCameraLookAt.z += Math.sign(this.newCameraLookAt.z - this.myCameraLookAt.z) * Math.min(Math.abs(this.newCameraLookAt.z - this.myCameraLookAt.z), this.myCameraSpeed * delta * Math.abs(target.z)) ;
        }
        
        this.camera.lookAt(this.myCameraLookAt);


        requestAnimationFrame(this.render.bind(this));
    }

    EndGameCutscene(player){
        this.myCameraTarget.x = -50;
        this.newCameraLookAt.x = -1100;

        this.playerWarriors.forEach( e => {
            if(player == true){
                e.SetAction(e.animationActions['victory'])
            } else {
                e.SetAction(e.animationActions['sad'])
            }
        })

        setTimeout( () => {
            this.myCameraTarget.x = -1100;
            this.myCameraTarget.y = 70;
            this.myCameraTarget.z = 900;
            this.newCameraLookAt = this.playerCastle.position.clone();
        }, 5000 )
    }

    CreatePlayerWarriors(){
        let modelObj = {
            model: this.library.models.playerModel,
            idle: this.library.models.playerIdle,
            ready: this.library.models.playerReady,
            sad: this.library.models.playerSad,
            victory: this.library.models.playerVictory
        }
        for(let i = 0; i < 5; i++){
            let player = new Player(0,0,modelObj);
            player.SetAction(player.animationActions['ready'])
            player.position.set(-1000 + (i * -50), 37 + Math.min(i, 4 - i) * 1, 1050 - Math.min(i, 4 - i) * 25);
            player.scale.set(.25, .25, .25)
            player.lookAt(player.position.x, player.position.y, 0);
            this.scene.add(player);
            this.players.push(player);
            this.playerWarriors.push(player);
        }
    }

    CreateIslands(){
        let playerIsland = SkeletonUtils.clone(this.library.models.island);
        playerIsland.position.set(0, -72, 114);
        this.scene.add(playerIsland);

        let enemyIsland = SkeletonUtils.clone(this.library.models.island);
        enemyIsland.position.set(0, -72, -114);
        enemyIsland.scale.z = -1 * enemyIsland.scale.z;
        this.scene.add(enemyIsland);
        
        let playerCastleIsland = SkeletonUtils.clone(this.library.models.island);
        playerCastleIsland.scale.set(1,1,1);
        playerCastleIsland.position.set(-1100, -250, 1200);
        this.scene.add(playerCastleIsland);
        
        let enemyCastleIsland = SkeletonUtils.clone(this.library.models.island);
        enemyCastleIsland.scale.set(1,1,1);
        enemyCastleIsland.position.set(-1100, -250, -1200);
        enemyCastleIsland.scale.z = -1 * enemyCastleIsland.scale.z;
        this.scene.add(enemyCastleIsland);
    }

    CreatePlayerCastle(){
        this.playerCastle = this.library.models.castle.clone();
        console.log(this.playerCastle);
        this.playerCastle.position.set(-1100, 48, 1250);
        this.playerCastle.rotation.z = -Math.PI / 2;
        this.scene.add(this.playerCastle);
    }

    CreateEnemyCastle(){
        this.enemyCastle = this.library.models.castle.clone();
        this.enemyCastle.position.set(-1100, 48, -1250);
        this.enemyCastle.rotation.z = Math.PI / 2;
        this.scene.add(this.enemyCastle);
    }

    CreatePlayerCannon(){
        this.playerCannon = this.library.models.cannon.clone();
        this.playerCannon.position.set(-1100, 40, 1120);
        this.scene.add(this.playerCannon);
    }

    CreateEnemyCannon(){
        this.enemyCannon = this.library.models.cannon.clone();
        this.enemyCannon.position.set(-1100, 40, -1120);
        this.enemyCannon.rotation.y = Math.PI;
        this.scene.add(this.enemyCannon);
    }

    addPlayerWarrior(){
        this.CreateIslands();
        this.CreatePlayerCastle();
        // this.CreateEnemyCastle();
        // this.CreatePlayerWarriors();
        // this.EndGameCutscene(true);

        let playerModels = {
            model: this.library.models.playerModel,
            idle: this.library.models.playerIdle,
            bored: this.library.models.playerBored,
            ready: this.library.models.playerReady,
            sad: this.library.models.playerSad,
            victory: this.library.models.playerVictory
        }
        this.myPlayer = new Player(0, 0, playerModels);
        this.myPlayer.position.set(0,0,128);
        this.myPlayer.rotation.set(0, 5/6 * Math.PI, 0);
        this.myPlayer.SetAction(this.myPlayer.animationActions[this.myPlayerStatus]);
        this.scene.add(this.myPlayer);
        this.players.push(this.myPlayer);
    }

    addEnemyWarrior() {
        this.CreateEnemyCastle();

        let playerModels = {
            model: this.library.models.playerModel,
            idle: this.library.models.playerIdle,
            bored: this.library.models.playerBored,
            ready: this.library.models.playerReady,
            sad: this.library.models.playerSad,
            victory: this.library.models.playerVictory
        }
        this.enemyPlayer = new Player(0, 0, playerModels);
        this.enemyPlayer.position.set(0,0,-128);
        this.enemyPlayer.rotation.set(0, 1/6 * Math.PI, 0);
        this.enemyPlayer.scale.x = -1 * this.enemyPlayer.scale.x;
        this.enemyPlayer.SetAction(this.enemyPlayer.animationActions[this.enemyPlayerStatus]);

        this.myPlayerStatus = 'ready';
        this.myPlayer.SetAction(this.myPlayer.animationActions[this.myPlayerStatus]);

        this.scene.add(this.enemyPlayer);
        this.players.push(this.enemyPlayer);
    }


    /**
     * @param {{player: string, enemy: string}} statusList 
     */
    Show(statusList = null){
        this.container.style.zIndex = "30000"

        if(statusList != null && this.myPlayer && this.enemyPlayer){
            console.log("?")
            this.myPlayerStatus = statusList.player;
            this.enemyPlayerStatus = statusList.enemy
            
            this.myPlayer.SetAction(this.myPlayer.animationActions[this.myPlayerStatus]);
            this.enemyPlayer.SetAction(this.enemyPlayer.animationActions[this.enemyPlayerStatus]);
        }
    }
    
    Hide() {
        this.container.style.zIndex = "-1"
        
        if(this.myPlayer && this.enemyPlayer){
            console.log("?")
            this.myPlayerStatus = 'ready';
            this.enemyPlayerStatus = 'ready';
    
            this.myPlayer.SetAction(this.myPlayer.animationActions[this.myPlayerStatus]);
            this.enemyPlayer.SetAction(this.enemyPlayer.animationActions[this.enemyPlayerStatus]);
        }
    }
}