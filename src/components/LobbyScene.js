import { AmbientLight, AxesHelper, Box3, BoxGeometry, BufferGeometry, CameraHelper, Clock, DoubleSide, Group, Material, Mesh, MeshBasicMaterial, Plane, PlaneGeometry, PlaneHelper, RepeatWrapping, Scene, Vector3 } from "three";
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
    constructor(container, library) {
        this.container = container;
        this.library = library;

        this.scene = new Scene();
        // @ts-ignore
        this.renderer = new Renderer(this.container, true);
        this.camera = new Camera(75, this.renderer);

        this.camera.position.set(220, 120, 0);
        this.camera.lookAt(new Vector3(0, 120, 0));
        this.camera.updateProjectionMatrix();

        this.renderThisScene = true;

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
        this.sun.target.position.set(0, 0, 0);

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

        this.playerCastleBuildStatusPercent = 0;
        this.enemyCastleBuildStatusPercent = 0;

        // this.castleMin = 110;
        this.castleMin = 33;
        this.castleMax = 110;

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
        this.enemyPlayerStatus = 'ready' + Math.ceil(Math.random() * 3);

        // const controls = new OrbitControls(this.camera, this.renderer.domElement);

        // this.camera.position.set(-1100, 70, 900);
        // this.camera.lookAt(new Vector3(-1100, 48, 1250))

        this.scene.background = this.library.textures.clouds;
        this.scene.background.offset.set(0, 0);
        this.scene.background.wrapS = this.scene.background.wrapT = RepeatWrapping;
        this.scene.background.repeat.set(0.5, 1);


        this.Hide();
        this.render();
    }

    render() {
        if (this.renderThisScene) {
            this.renderer.render(this.scene, this.camera);

            let delta = this.clock.getDelta();

            this.players.forEach(player => {
                player.Update(delta)
            })

            let b = this.scene.background;
            // @ts-ignore
            b.offset.x += 0.015 * delta;

            if (this.camera) {
                if (this.camera.position.x == this.myCameraTarget.x && this.camera.position.y == this.myCameraTarget.y && this.camera.position.z == this.myCameraTarget.z) {
                    this.myCameraMove = false;
                } else {
                    this.myCameraMove = true;
                }
            }
            if (this.myCameraMove == true) {
                let target = new Vector3(this.myCameraTarget.x, this.myCameraTarget.y, this.myCameraTarget.z).sub(this.camera.position).normalize();
                this.camera.position.x += Math.sign(this.myCameraTarget.x - this.camera.position.x) * Math.min(Math.abs(this.myCameraTarget.x - this.camera.position.x), this.myCameraSpeed * delta * Math.abs(target.x));
                this.camera.position.y += Math.sign(this.myCameraTarget.y - this.camera.position.y) * Math.min(Math.abs(this.myCameraTarget.y - this.camera.position.y), this.myCameraSpeed * delta * Math.abs(target.y));
                this.camera.position.z += Math.sign(this.myCameraTarget.z - this.camera.position.z) * Math.min(Math.abs(this.myCameraTarget.z - this.camera.position.z), this.myCameraSpeed * delta * Math.abs(target.z));
            }
            if (this.camera) {
                if (this.myCameraLookAt.x == this.newCameraLookAt.x && this.myCameraLookAt.y == this.newCameraLookAt.y && this.myCameraLookAt.z == this.newCameraLookAt.z) {
                    this.myCameraRotate = false;
                } else {
                    this.myCameraRotate = true;
                }
            }
            if (this.myCameraRotate == true) {
                let target = new Vector3(this.newCameraLookAt.x, this.newCameraLookAt.y, this.newCameraLookAt.z).sub(this.myCameraLookAt).normalize();
                this.myCameraLookAt.x += Math.sign(this.newCameraLookAt.x - this.myCameraLookAt.x) * Math.min(Math.abs(this.newCameraLookAt.x - this.myCameraLookAt.x), this.myCameraSpeed * delta * Math.abs(target.x));
                this.myCameraLookAt.y += Math.sign(this.newCameraLookAt.y - this.myCameraLookAt.y) * Math.min(Math.abs(this.newCameraLookAt.y - this.myCameraLookAt.y), this.myCameraSpeed * delta * Math.abs(target.y));
                this.myCameraLookAt.z += Math.sign(this.newCameraLookAt.z - this.myCameraLookAt.z) * Math.min(Math.abs(this.newCameraLookAt.z - this.myCameraLookAt.z), this.myCameraSpeed * delta * Math.abs(target.z));
            }

            this.camera.lookAt(this.myCameraLookAt);
        }

        requestAnimationFrame(this.render.bind(this));
    }

    EndGameCutscene(player) {
        this.myCameraTarget.x = -50;
        this.newCameraLookAt.x = -1100;

        this.playerWarriors.forEach(e => {
            if (player == true) {
                e.SetAction(e.animationActions['victory' + Math.ceil(Math.random() * 5)])
            } else {
                e.SetAction(e.animationActions['lose' + Math.ceil(Math.random() * 4)])
            }
        })
        this.enemyWarriors.forEach(e => {
            if (player == true) {
                e.SetAction(e.animationActions['lose' + Math.ceil(Math.random() * 4)])
            } else {
                e.SetAction(e.animationActions['victory' + Math.ceil(Math.random() * 5)])
            }
        })

        setTimeout(() => {
            this.myCameraTarget.x = -1100;
            this.myCameraTarget.y = 70;
            this.myCameraTarget.z = 900;
            this.newCameraLookAt = this.playerCastle.position.clone();
            // this.myCameraTarget.x = -1100;
            // this.myCameraTarget.y = 70;
            // this.myCameraTarget.z = -900;
            // this.newCameraLookAt = this.enemyCastle.position.clone();
        }, 5000)
    }

    CreatePlayerWarriors() {
        let modelObj = {
            model: this.library.models.playerModel,
            idle: this.library.models.playerIdle,
            ready1: this.library.models.playerReady1,
            ready2: this.library.models.playerReady2,
            ready3: this.library.models.playerReady3,
            lose1: this.library.models.playerLose1,
            lose2: this.library.models.playerLose2,
            lose3: this.library.models.playerLose3,
            lose4: this.library.models.playerLose4,
            victory1: this.library.models.playerVictory1,
            victory2: this.library.models.playerVictory2,
            victory3: this.library.models.playerVictory3,
            victory4: this.library.models.playerVictory4,
            victory5: this.library.models.playerVictory5
        }
        for (let i = 0; i < 5; i++) {
            let player = new Player(0, 0, modelObj);
            player.SetAction(player.animationActions['ready' + Math.ceil(Math.random() * 3)])
            player.position.set(-1000 + (i * -50), 37 + Math.min(i, 4 - i) * 1, 1050 - Math.min(i, 4 - i) * 25);
            player.scale.set(.25, .25, .25)
            player.lookAt(player.position.x, player.position.y, 0);
            this.scene.add(player);
            this.players.push(player);
            this.playerWarriors.push(player);
        }
    }

    CreateEnemyWarriors() {
        let modelObj = {
            model: this.library.models.playerModel,
            idle: this.library.models.playerIdle,
            ready1: this.library.models.playerReady1,
            ready2: this.library.models.playerReady2,
            ready3: this.library.models.playerReady3,
            lose1: this.library.models.playerLose1,
            lose2: this.library.models.playerLose2,
            lose3: this.library.models.playerLose3,
            lose4: this.library.models.playerLose4,
            victory1: this.library.models.playerVictory1,
            victory2: this.library.models.playerVictory2,
            victory3: this.library.models.playerVictory3,
            victory4: this.library.models.playerVictory4,
            victory5: this.library.models.playerVictory5
        }
        for (let i = 0; i < 5; i++) {
            let player = new Player(0, 0, modelObj);
            player.SetAction(player.animationActions['ready' + Math.ceil(Math.random() * 3)])
            player.position.set(-1000 + (i * -50), 37 + Math.min(i, 4 - i) * 1, -1050 + Math.min(i, 4 - i) * 25);
            player.scale.set(.25, .25, .25)
            player.lookAt(player.position.x, player.position.y, 0);
            this.scene.add(player);
            this.players.push(player);
            this.enemyWarriors.push(player);
        }
    }

    CreateIslands() {
        let playerIsland = SkeletonUtils.clone(this.library.models.island);
        playerIsland.position.set(0, -72, 114);
        this.scene.add(playerIsland);

        let enemyIsland = SkeletonUtils.clone(this.library.models.island);
        enemyIsland.position.set(0, -72, -114);
        enemyIsland.scale.z = -1 * enemyIsland.scale.z;
        this.scene.add(enemyIsland);

        let playerCastleIsland = SkeletonUtils.clone(this.library.models.island);
        playerCastleIsland.scale.set(1, 1, 1);
        playerCastleIsland.position.set(-1100, -250, 1200);
        this.scene.add(playerCastleIsland);

        let enemyCastleIsland = SkeletonUtils.clone(this.library.models.island);
        enemyCastleIsland.scale.set(1, 1, 1);
        enemyCastleIsland.position.set(-1100, -250, -1200);
        enemyCastleIsland.scale.z = -1 * enemyCastleIsland.scale.z;
        this.scene.add(enemyCastleIsland);
    }

    CreatePlayerCastle() {
        /**
         * @type {Group}
         */
        this.playerCastle = this.library.models.playerCastle.clone();
        this.playerCastle.position.set(-1100, 48, 1250);
        this.playerCastle.rotation.z = -Math.PI / 2;
        this.scene.add(this.playerCastle);

        this.playerCastleBuildPlane = new Plane(new Vector3(0, -1, 0), this.castleMin);
        // let helper = new PlaneHelper(this.playerCastleBuildPlane, 1000, 0xffff00)
        // this.scene.add(helper);
        // min 35, max 110

        // @ts-ignore
        this.playerCastle.traverse((/** @type {Mesh<BufferGeometry, Material>} */object) => {
            if (object instanceof Mesh) {
                object.material.clippingPlanes = [this.playerCastleBuildPlane];
                object.material.clipIntersection = false;
                object.material.clipShadows = true;
            }
        })

        let flag1 = this.library.models.playerFlag.clone();
        flag1.scale.set(.1, .1, .1)
        flag1.position.set(-1075, 35, 1125);
        this.scene.add(flag1);

        let flag2 = this.library.models.playerFlag.clone();
        flag2.scale.set(-.1, .1, .1)
        flag2.position.set(-1120, 35, 1125);
        this.scene.add(flag2);

    }

    CreateEnemyCastle() {
        this.enemyCastle = this.library.models.enemyCastle.clone(true);
        this.enemyCastle.position.set(-1100, 48, -1250);
        this.enemyCastle.rotation.z = Math.PI / 2;
        this.scene.add(this.enemyCastle);

        this.enemyCastleBuildPlane = new Plane(new Vector3(0, -1, 0), this.castleMin);
        // min 35, max 110

        // @ts-ignore
        this.enemyCastle.traverse((/** @type {Mesh<BufferGeometry, Material>} */object) => {
            if (object instanceof Mesh) {
                object.material.clippingPlanes = [this.enemyCastleBuildPlane];
                object.material.clipIntersection = false;
                object.material.clipShadows = true;
            }
        })

        let flag1 = this.library.models.enemyFlag.clone();
        flag1.scale.set(.1, .1, -.1)
        flag1.position.set(-1080, 35, -1125);
        this.scene.add(flag1);

        let flag2 = this.library.models.enemyFlag.clone();
        flag2.scale.set(-.1, .1, -.1)
        flag2.position.set(-1125, 35, -1125);
        this.scene.add(flag2);
    }

    CreatePlayerCannon() {
        this.playerCannon = this.library.models.cannon.clone();
        this.playerCannon.position.set(-1100, 40, 1120);
        this.scene.add(this.playerCannon);
    }

    CreateEnemyCannon() {
        this.enemyCannon = this.library.models.cannon.clone();
        this.enemyCannon.position.set(-1100, 40, -1120);
        this.enemyCannon.rotation.y = Math.PI;
        this.scene.add(this.enemyCannon);
    }

    addPlayerWarrior() {
        this.CreateIslands();
        this.CreatePlayerCastle();
        // this.CreateEnemyCastle();
        // this.CreatePlayerWarriors();
        // this.CreateEnemyWarriors();
        // this.CreatePlayerCannon();
        // this.EndGameCutscene(true);

        let playerModels = {
            model: this.library.models.playerModel,
            idle: this.library.models.playerIdle,
            bored: this.library.models.playerBored,
            ready1: this.library.models.playerReady1,
            ready2: this.library.models.playerReady2,
            ready3: this.library.models.playerReady3,
            lose: this.library.models.playerLose1,
            victory: this.library.models.playerVictory1
        }
        this.myPlayer = new Player(0, 0, playerModels);
        this.myPlayer.position.set(0, 0, 128);
        this.myPlayer.rotation.set(0, 5 / 6 * Math.PI, 0);
        this.myPlayer.SetAction(this.myPlayer.animationActions[this.myPlayerStatus]);
        this.scene.add(this.myPlayer);
        this.players.push(this.myPlayer);

        let playerFlag = this.library.models.playerFlag.clone();
        playerFlag.position.set(-50, -2, 155);
        playerFlag.scale.set(.25, .3, .25)
        playerFlag.rotation.y = -Math.PI / 6
        this.scene.add(playerFlag);
    }

    addEnemyWarrior() {
        this.CreateEnemyCastle();

        let playerModels = {
            model: this.library.models.playerModel,
            idle: this.library.models.playerIdle,
            bored: this.library.models.playerBored,
            ready1: this.library.models.playerReady1,
            ready2: this.library.models.playerReady2,
            ready3: this.library.models.playerReady3,
            lose: this.library.models.playerLose1,
            victory: this.library.models.playerVictory1
        }
        this.enemyPlayer = new Player(0, 0, playerModels);
        this.enemyPlayer.position.set(0, 0, -128);
        this.enemyPlayer.rotation.set(0, 1 / 6 * Math.PI, 0);
        this.enemyPlayer.scale.x = -1 * this.enemyPlayer.scale.x;
        this.enemyPlayer.SetAction(this.enemyPlayer.animationActions[this.enemyPlayerStatus]);

        this.myPlayerStatus = 'ready' + Math.ceil(Math.random() * 3);
        this.myPlayer.SetAction(this.myPlayer.animationActions[this.myPlayerStatus]);

        this.scene.add(this.enemyPlayer);
        this.players.push(this.enemyPlayer);

        let enemyFlag = this.library.models.enemyFlag.clone();
        enemyFlag.position.set(-50, -2, -155);
        enemyFlag.scale.set(.25, .3, -.25);
        enemyFlag.rotation.y = Math.PI / 6;
        this.scene.add(enemyFlag);
    }


    /**
     * @param {{player: string, enemy: string}} statusList 
     */
    Show(statusList = null) {
        this.container.style.zIndex = "19000"
        this.renderThisScene = true;

        if (statusList != null && this.myPlayer && this.enemyPlayer) {
            this.myPlayerStatus = statusList.player;
            this.enemyPlayerStatus = statusList.enemy

            this.myPlayer.SetAction(this.myPlayer.animationActions[this.myPlayerStatus]);
            this.enemyPlayer.SetAction(this.enemyPlayer.animationActions[this.enemyPlayerStatus]);
        }
    }

    Hide() {
        this.container.style.zIndex = "-1"
        // this.renderThisScene = false;

        if (this.myPlayer && this.enemyPlayer) {
            this.myPlayerStatus = 'ready' + Math.ceil(Math.random() * 3);
            this.enemyPlayerStatus = 'ready' + Math.ceil(Math.random() * 3);

            this.myPlayer.SetAction(this.myPlayer.animationActions[this.myPlayerStatus]);
            this.enemyPlayer.SetAction(this.enemyPlayer.animationActions[this.enemyPlayerStatus]);
        }
    }

    /**
     * @param {'player' | 'enemy'} who
     * @param {Number} percent
     */
    BuildCastle(who, percent) {
        if (who == 'player') {
            this.playerCastleBuildStatusPercent = percent;
            this.playerCastleBuildPlane.constant = this.castleMin + (percent * (this.castleMax - this.castleMin));
        } else {
            this.enemyCastleBuildStatusCount = percent;
            this.enemyCastleBuildPlane.constant = this.castleMin + (percent * (this.castleMax - this.castleMin));
        }
    }
}