import { AmbientLight, AxesHelper, Clock, Scene, Vector3 } from "three";
import Camera from "./Camera";
import Renderer from "./Renderer";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Library from "./Library";
import Player from "./Player";

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

        this.ambientLight = new AmbientLight(0xffffff, 1);
        this.scene.add(this.ambientLight);

        /**
         * @type {Player[]}
         */
        this.players = [];

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

        requestAnimationFrame(this.render.bind(this));
    }

    addPlayerWarrior(){
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