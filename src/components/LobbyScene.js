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

        this.clock = new Clock();

        this.myPlayerStatus = 'bored';
        this.enemyPlayerStatus = 'ready';

        const controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.Hide();
        this.render();
    }

    render(){
        this.renderer.render(this.scene, this.camera);

        let delta = this.clock.getDelta();

        this.players.forEach( player => {
            player.Update(delta)
        })

        requestAnimationFrame(this.render.bind(this));
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
        playerCastleIsland.position.set(-1000, -250, 1200);
        this.scene.add(playerCastleIsland);
        
        let enemyCastleIsland = SkeletonUtils.clone(this.library.models.island);
        enemyCastleIsland.scale.set(1,1,1);
        enemyCastleIsland.position.set(-1000, -250, -1200);
        enemyCastleIsland.scale.z = -1 * enemyCastleIsland.scale.z;
        this.scene.add(enemyCastleIsland);
    }

    CreatePlayerCastle(){
        this.playerCastle = SkeletonUtils.clone(this.library.models.castle);
        this.playerCastle.position.set(-1000, 48, 1250);
        this.playerCastle.rotation.y = Math.PI / 2;
        this.scene.add(this.playerCastle);
    }

    CreateEnemyCastle(){
        this.playerCastle = SkeletonUtils.clone(this.library.models.castle);
        this.playerCastle.position.set(-1000, 48, -1250);
        this.playerCastle.rotation.y = -Math.PI / 2;
        this.scene.add(this.playerCastle);
    }

    addPlayerWarrior(){
        this.CreateIslands();
        this.CreatePlayerCastle();
        this.CreateEnemyCastle();

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