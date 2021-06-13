import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import {
    Scene,
    GridHelper,
    AmbientLight,
    AxesHelper,
    Vector3,
    Euler,
    CameraHelper,
    DirectionalLightHelper,
    Vector2,
    Clock
} from 'three';

import Renderer from './Renderer';
import Camera from './Camera';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import LevelManager from "./LevelManager";
import InputManager from './InputManager';
import Sun from './Sun';
import Utility from './Utility';
import Socket from './Socket';
import Config from './Config';
import Menu from './Menu';
import GUI from './GUI';
import Player from './Player';
import LobbyScene from './LobbyScene';
import PowerupManager from './PowerupManager';

export default class Main {
    /**
     * @param {HTMLDivElement} container 
     */
    constructor(container) {
        this.container = container;
        this.scene = new Scene();
        this.renderer = new Renderer(container);
        this.camera = new Camera(75, this.renderer);
        this.levelManager = new LevelManager(this.scene);
        this.levelManager.LoadLibrary()
            .then( () => {
                this.menu.show('startGame');
            })

        this.lobbyScene = new LobbyScene(document.getElementById("root2"), this.levelManager.library);

        /**
         * @type {'lobby' | 'game'}
         */
        this.currentRender = 'lobby'

        this.menu = new Menu();
        this.menu.show("title");
        this.menu.hide("startGame");
        this.menu.html.startGame.addEventListener("click", this.startSearch.bind(this));

        this.gui = new GUI();
        // this.gui.showAll();

        this.socket = null;

        this.clock = new Clock();

        this.playerCompleteCurrentLevel = false;

        this.playerMovementRule = [false];

        this.camera.position.set(500, 1000, 500);
        this.camera.lookAt(500, 0, 500);
        this.camera.updateProjectionMatrix();

        this.stats = Stats();
        this.stats.showPanel(0);

        // const controls = new OrbitControls(this.camera, this.renderer.domElement);
        // this.camera.lookAt(500, 0, 500);

        document.body.appendChild(this.stats.dom);

        this.inputManager = new InputManager(this.playerMovementRule);
        this.inputManager.RegisterEventCapture();
        this.inputManager.Add("left", this.moveLeft.bind(this), ["KeyA"], true, 20);
        this.inputManager.Add("right", this.moveRight.bind(this), ["KeyD"], true, 20);
        this.inputManager.Add("up", this.moveUp.bind(this), ["KeyW"], true, 20);
        this.inputManager.Add("down", this.moveDown.bind(this), ["KeyS"], true, 20);
        this.inputManager.Add("reset", this.levelManager.reset.bind(this.levelManager), ["KeyR"], false);

        this.powerupManager = new PowerupManager();
    }

    render() {
        this.stats.begin()
        let delta = this.clock.getDelta();

        for (const player of this.levelManager.objects.playersFalling) {
            player.fall(delta);
        }

        if (this.levelManager.functionThatChecksIfThePlayerWonTheLevelByCheckingIfEveryGoalIsOccupiedByAPlayerEntity()) {
            if (this.playerCompleteCurrentLevel == false) {
                this.playerCompleteCurrentLevel = true;
                this.playerMovementRule[0] = false;
                console.log("LEVEL IS DONE");

                this.socket.Send(this.socket.createMessage("done"));

            }
        }

        // this.camera.rotateOnAxis(new Vector3(1, 0, 0), Math.PI / 180);

        if (this.levelManager.objects.sun) {
            let v = Utility.rotateVectorAroundPoint(this.levelManager.objects.sun.position, this.levelManager.center, new Euler(0, Math.PI / 3600, 0));
            this.levelManager.objects.sun.position.copy(v);
        }
        let canMove = true;
        // Update Players Anim
        this.levelManager.objects.players.forEach(e => {
            e.Update(delta);
            if (e.needMove == true) {
                canMove = false;
            }
        })
        this.levelManager.objects.playersFalling.forEach(e => {
            e.Update(delta);
        })
        this.playerMovementRule[0] = canMove;

        this.levelManager.Update();

        // Update time
        let newTime = Date.now();
        let newDate = new Date(newTime);

        this.gui.edit(this.ParseToTimeString(newDate.getHours(), newDate.getMinutes(), newDate.getSeconds()), 'gameInfo', 'time');

        this.updateCamera(delta);

        this.renderer.render(this.scene, this.camera);

        this.stats.end()

        this.animationFrame = requestAnimationFrame(this.render.bind(this));
    }

    /**
     * @param {Number} h
     * @param {Number} m
     * @param {Number} s
     */
    ParseToTimeString(h, m, s) {
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
    }

    startSearch() {
        this.menu.hide("title");
        this.menu.show("lobby");

        this.socket = new Socket();

        this.socket.Add("room_assigned", this.EnterRoom.bind(this));
        this.socket.Add("config", this.ReceiveConfig.bind(this));
        this.socket.Add("forfeit", this.EnemyForfeit.bind(this));
        this.socket.Add("new_level", this.NewLevel.bind(this));
        this.socket.Add("wait", this.WaitForNextMap.bind(this));
        this.socket.Add("win", this.WinBattle.bind(this));
        this.socket.Add("lose", this.LoseBattle.bind(this));
        this.socket.Add("powerup_target", this.PowerupTarget.bind(this));
        this.socket.Add("progress_bar", this.UpdateBars.bind(this));

        this.lobbyScene.addPlayerWarrior();
        this.lobbyScene.Show();
    }

    /**
     * @param {String} data
     */
    EnterRoom(data) {
        console.log("SERVER FOUND ROOM FOR U");
        this.menu.hide("lobby");
        this.menu.show("startsSoon");
        this.menu.edit("startsSoon", "Get ready... </br>Game will begin shortly");
        this.lobbyScene.addEnemyWarrior();
    }

    /**
     * @param {{easyCount: Number, mediumCount: Number, hardCount: Number, totalScore: Number, levelCount: Number}} data
     */
    ReceiveConfig(data) {
        this.gui.totalLevels = data.levelCount;
        this.gui.maxPoints = data.totalScore;

        this.gui.edit(`<span>TOTAL: </span>${data.levelCount}`, 'gameInfo', 'mapCount');
        this.gui.edit(`<span class='diffEasy'>EASY: </span>${data.easyCount}`, 'gameInfo', 'easyMapCount');
        this.gui.edit(`<span class='diffMedium'>MEDIUM: </span>${data.mediumCount}`, 'gameInfo', 'mediumMapCount');
        this.gui.edit(`<span class='diffHard'>HARD: </span>${data.hardCount}`, 'gameInfo', 'hardMapCount');

        this.gui.edit('21:37:69', 'gameInfo', 'time');
    }

    /**
     * @param {String} data
     */
    EnemyForfeit(data) {
        console.log("YOUR ENEMY WAS NOOB AND HE HAS GONE AWAY BLYEAT :D");

        this.menu.hide("roomTransition");
        this.menu.show("win");

        this.playerMovementRule[0] = false;
        cancelAnimationFrame(this.animationFrame);
    }

    /**
     * @param {import('./LevelManager').Level} data
     */
    NewLevel(data) {
        console.log("U GOTTA NEW LEVEL BRO");

        cancelAnimationFrame(this.animationFrame);

        this.currentLevel = data;

        this.levelManager.empty();
        this.levelManager.build(data)
            .then(() => {
                this.menu.hide("startsSoon");
                this.menu.hide("roomTransition");
                this.lobbyScene.Hide();

                this.gui.currentMap++;
                this.gui.currentMapDifficulty = data.difficulty;

                this.gui.edit(`<span>CURRENT MAP: </span> ${this.gui.currentMap}/${this.gui.totalLevels}`, 'gameInfo', 'currentMapCount');
                this.gui.edit(`CURRENT DIFFICULTY: <span class="diff${this.gui.currentMapDifficulty[0].toUpperCase()}${this.gui.currentMapDifficulty.substr(1)}">${this.gui.currentMapDifficulty.toUpperCase()}</span>`, 'gameInfo', 'currentMapDifficulty');

                this.gui.showAll();

                this.camera.position.set(this.levelManager.center.x, 1000, this.levelManager.lengthZ * 1.2);
                this.camera.lookAt(this.levelManager.center);

                this.playerMovementRule[0] = true;
                this.playerCompleteCurrentLevel = false;

                this.render();
            })
    }

    WaitForNextMap() {
        console.log("U WAIT FOR NEXT MAP");

        this.menu.show("roomTransition");
        this.lobbyScene.Show({ player: 'victory', enemy: 'sad' });
    }

    WinBattle() {
        console.log("YOU WIN MY FRIEND");

        this.menu.hide("roomTransition");
        this.menu.show("win");

        this.lobbyScene.Show({player: 'victory', enemy: 'sad'});
        this.lobbyScene.CreatePlayerCannon();
        this.lobbyScene.CreatePlayerWarriors();
        setTimeout( () => {
            this.lobbyScene.EndGameCutscene(true);
        }, 5000)
        
        this.playerMovementRule[0] = false;
        cancelAnimationFrame(this.animationFrame);
    }
    
    LoseBattle() {
        console.log("YOU LOSE MY FRIEND");
        
        this.menu.hide("roomTransition");
        this.menu.show("lose");
        
        this.lobbyScene.Show({player: 'sad', enemy: 'victory'});
        this.lobbyScene.CreateEnemyCannon();
        this.lobbyScene.CreatePlayerWarriors();
        setTimeout( () => {
            this.lobbyScene.EndGameCutscene(false);
        }, 5000)

        this.playerMovementRule[0] = false;
        cancelAnimationFrame(this.animationFrame);
    }

    /**
     * @param {{name: String}} data 
     */
    PowerupTarget(data) {
        console.log("ENEMY USE POWERUP ON U");
    }

    /**
     * @param {{you: Number, enemy: Number}} data 
     */
    UpdateBars(data) {
        console.log(data);
        this.gui.html.statusBars.player.style.width = `${data.you / this.gui.maxPoints * 100}%`;
        this.gui.html.statusBars.enemy.style.width = `${data.enemy / this.gui.maxPoints * 100}%`;
    }


    /**
     * @param {Number} delta
     */
    updateCamera(delta) {
        let lineSquareRoot = 2;

        // 1. center
        this.levelManager.center;

        //2. bigger aspect
        let biggerDimension = innerWidth * this.levelManager.lengthX >= innerHeight * this.levelManager.lengthZ ?
            this.levelManager.lengthX : this.levelManager.lengthZ * innerHeight / innerWidth;

        //3. equations
        let eq1 = new Vector3(-Math.sqrt(lineSquareRoot), -1, this.levelManager.center.x * Math.sqrt(lineSquareRoot));
        let eq2 = new Vector3(0, -1, biggerDimension);

        //4. matrix
        let matrix = new Vector3(
            eq1.x * eq2.y - eq2.x * eq1.y,
            -eq1.z * eq2.y - -eq2.z * eq1.y,
            eq1.x * -eq2.z - eq2.x * -eq1.z
        );

        //5. camera position
        let cameraPosition = new Vector2(matrix.y / matrix.x, matrix.z / matrix.x);

        //6. camera position adjusted
        let cameraPositionAdjusted = new Vector3(
            this.levelManager.center.x,
            cameraPosition.y,
            -cameraPosition.x + this.levelManager.lengthZ
        );

        // console.log(this.levelManager.center.x, this.levelManager.center.y, this.levelManager.center.z);
        // console.log(cameraPositionAdjusted.z);

        this.camera.position.copy(cameraPositionAdjusted);
        // this.camera.position.set(this.levelManager.center.x, 0, this.levelManager.lengthZ * 1.5);

        // this.camera.lookAt(this.levelManager.center);
        this.camera.rotation.set(0, 0, 0);
        this.camera.rotateX(- Math.PI / 3);

        if (this.powerupManager.states["camera_rotation"]) {
            this.powerupManager.cameraRotation += Math.PI / 3 * delta;

            let v = Utility.rotateVectorAroundPoint(this.camera.position, this.levelManager.center, new Euler(0, this.powerupManager.cameraRotation, 0));
            this.camera.position.copy(v);

            this.camera.lookAt(this.levelManager.center);
        }

        if (this.powerupManager.states["camera_shake"]) {
            this.camera.rotation.x += (Math.random() - 0.5) / 16;
            this.camera.rotation.y += (Math.random() - 0.5) / 16;
            this.camera.rotation.z += (Math.random() - 0.5) / 16;
        }
    }

    moveLeft() {
        this.levelManager.moveLeft.call(this.levelManager, this.powerupManager.states["inverted_keyboard"]);
    }

    moveRight() {
        this.levelManager.moveRight.call(this.levelManager, this.powerupManager.states["inverted_keyboard"]);
    }

    moveUp() {
        this.levelManager.moveUp.call(this.levelManager, this.powerupManager.states["inverted_keyboard"]);
    }

    moveDown() {
        this.levelManager.moveDown.call(this.levelManager, this.powerupManager.states["inverted_keyboard"]);
    }
}