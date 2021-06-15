import { DoubleSide, LoadingManager, Material, MeshPhongMaterial, MeshStandardMaterial, Object3D, RepeatWrapping, TextureLoader } from "three";

import grass001_512_ao from "../resources/textures/grass001/grass001_512_ao.png";
import grass001_512_color from "../resources/textures/grass001/grass001_512_color.png";
import grass001_512_dis from "../resources/textures/grass001/grass001_512_dis.png";
import grass001_512_normal from "../resources/textures/grass001/grass001_512_normal.png";
import grass001_512_rough from "../resources/textures/grass001/grass001_512_rough.png";

import metal007_512_color from "../resources/textures/metal007/metal007_512_color.png";
import metal007_512_dis from "../resources/textures/metal007/metal007_512_dis.png";
import metal007_512_metal from "../resources/textures/metal007/metal007_512_metal.png";
import metal007_512_normal from "../resources/textures/metal007/metal007_512_normal.png";
import metal007_512_rough from "../resources/textures/metal007/metal007_512_rough.png";

import metal034_512_color from "../resources/textures/metal034/metal034_512_color.png";
import metal034_512_dis from "../resources/textures/metal034/metal034_512_dis.png";
import metal034_512_metal from "../resources/textures/metal034/metal034_512_metal.png";
import metal034_512_normal from "../resources/textures/metal034/metal034_512_normal.png";
import metal034_512_rough from "../resources/textures/metal034/metal034_512_rough.png";

import playerModel from "../resources/models/player/player.fbx";
import playerWalk from "../resources/models/player/player@walk.fbx";
import playerIdle from "../resources/models/player/player@idle.fbx";
import playerFall from "../resources/models/player/player@fall.fbx";
import playerBored from "../resources/models/player/player@bored.fbx";
import playerReady from "../resources/models/player/player@ready.fbx";
import playerSad from "../resources/models/player/player@sad.fbx";
import playerVictory from "../resources/models/player/player@victory.fbx";

import rock from "../resources/models/rock/Rock3.fbx";

import island from "../resources/models/island/island.fbx";
import castle from "../resources/models/castle/castle.gltf";

import cannon from "../resources/models/cannon/cannon.gltf";

import playerFlag from "../resources/models/flags/playerFlag.fbx";
import enemyFlag from "../resources/models/flags/enemyFlag.fbx";

import { FBXLoader } from "three/examples/jsm/loaders/fbxloader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class Library {
    constructor() {
        this.textures = {
            grass001_512_ao: null,
            grass001_512_color: null,
            grass001_512_dis: null,
            grass001_512_normal: null,
            grass001_512_rough: null,

            metal007_512_color: null,
            metal007_512_dis: null,
            metal007_512_metal: null,
            metal007_512_normal: null,
            metal007_512_rough: null,

            metal034_512_color: null,
            metal034_512_dis: null,
            metal034_512_metal: null,
            metal034_512_normal: null,
            metal034_512_rough: null,
        }

        this.models = {
            playerModel: null,
            playerIdle: null,
            playerWalk: null,
            playerFall: null,
            playerBored: null,
            playerReady: null,
            playerSad: null,
            playerVictory: null,
            rock: null,
            island: null,
            playerCastle: null,
            enemyCastle: null,
            cannon: null,
            playerFlag: null,
            enemyFlag: null
        }

        /**
         * @typedef {"grass001" | "metal007" | "metal034"} Materials
         */

        /**
         * @type {{[x in Materials]: MeshStandardMaterial}}
         */
        this.materials = {
            grass001: null,
            metal034: null,
            metal007: null
        }
    }

    Load() {
        return new Promise((resolve, reject) => {
            this.LoadTextures();
            this.repeatMaterials();
            this.LoadModels()
                .then(() => {
                    resolve();
                })
        })
    }

    LoadTextures() {

        this.textures.grass001_512_ao = new TextureLoader().load(grass001_512_ao),
            this.textures.grass001_512_color = new TextureLoader().load(grass001_512_color),
            this.textures.grass001_512_dis = new TextureLoader().load(grass001_512_dis),
            this.textures.grass001_512_normal = new TextureLoader().load(grass001_512_normal),
            this.textures.grass001_512_rough = new TextureLoader().load(grass001_512_rough),

            this.textures.metal007_512_color = new TextureLoader().load(metal007_512_color),
            this.textures.metal007_512_dis = new TextureLoader().load(metal007_512_dis),
            this.textures.metal007_512_metal = new TextureLoader().load(metal007_512_metal),
            this.textures.metal007_512_normal = new TextureLoader().load(metal007_512_normal),
            this.textures.metal007_512_rough = new TextureLoader().load(metal007_512_rough),

            this.textures.metal034_512_color = new TextureLoader().load(metal034_512_color),
            this.textures.metal034_512_dis = new TextureLoader().load(metal034_512_dis),
            this.textures.metal034_512_metal = new TextureLoader().load(metal034_512_metal),
            this.textures.metal034_512_normal = new TextureLoader().load(metal034_512_normal),
            this.textures.metal034_512_rough = new TextureLoader().load(metal034_512_rough),


            this.materials.grass001 = new MeshStandardMaterial({
                aoMap: this.textures.grass001_512_ao,
                map: this.textures.grass001_512_color,
                // displacementMap: this.textures.grass001_512_dis,
                normalMap: this.textures.grass001_512_normal,
                bumpMap: this.textures.grass001_512_rough,
            }),
            this.materials.metal034 = new MeshStandardMaterial({
                map: this.textures.metal034_512_color,
                // displacementMap: this.textures.metal034_512_dis,
                metalnessMap: this.textures.metal034_512_metal,
                normalMap: this.textures.metal034_512_normal,
                bumpMap: this.textures.metal034_512_rough,
            }),
            this.materials.metal007 = new MeshStandardMaterial({
                map: this.textures.metal007_512_color,
                // displacementMap: this.textures.metal007_512_dis,
                metalnessMap: this.textures.metal007_512_metal,
                normalMap: this.textures.metal007_512_normal,
                bumpMap: this.textures.metal007_512_rough,
            })
    }

    LoadModels() {
        return new Promise((resolve, reject) => {
            let counter = Object.keys(this.models).length;

            let fbxLoader = new FBXLoader();
            let gltfLoader = new GLTFLoader();

            fbxLoader.load(playerModel, (object) => {
                object.traverse((child) => {
                    // @ts-ignore
                    if (child.isMesh) {
                        child.receiveShadow = true;
                        child.castShadow = true;
                    }
                })
                object.scale.set(.5, .5, .5)
                this.models.playerModel = object;
                if (--counter == 0) { resolve() };
            });
            fbxLoader.load(playerIdle, (object) => {
                object.scale.set(.5, .5, .5)
                this.models.playerIdle = object;
                if (--counter == 0) { resolve() };
            });
            fbxLoader.load(playerWalk, (object) => {
                object.scale.set(.5, .5, .5)
                this.models.playerWalk = object;
                if (--counter == 0) { resolve() };
            });
            fbxLoader.load(playerFall, (object) => {
                object.scale.set(.5, .5, .5)
                this.models.playerFall = object;
                if (--counter == 0) { resolve() };
            })
            fbxLoader.load(playerBored, (object) => {
                object.scale.set(.5, .5, .5)
                this.models.playerBored = object;
                if (--counter == 0) { resolve() };
            })
            fbxLoader.load(playerReady, (object) => {
                object.scale.set(.5, .5, .5)
                this.models.playerReady = object;
                if (--counter == 0) { resolve() };
            })
            fbxLoader.load(playerSad, (object) => {
                object.scale.set(.5, .5, .5)
                this.models.playerSad = object;
                if (--counter == 0) { resolve() };
            })
            fbxLoader.load(playerVictory, (object) => {
                object.scale.set(.5, .5, .5)
                this.models.playerVictory = object;
                if (--counter == 0) { resolve() };
            })

            fbxLoader.load(rock, (object) => {
                object.scale.set(.08, .1, .08);

                object.traverse((child) => {
                    // @ts-ignore
                    if (child.isMesh) {
                        child.receiveShadow = true;
                        child.castShadow = true;
                    }
                })

                this.models.rock = object;
                if (--counter == 0) { resolve() };
            });

            fbxLoader.load(island, (object) => {
                object.scale.set(.25, .25, .25);
                object.traverse((child) => {
                    // @ts-ignore
                    if (child.isMesh) {
                        child.receiveShadow = true;
                        child.material.shininess = 2;
                        // child.castShadow = true;
                    }
                })
                this.models.island = object;
                if (--counter == 0) { resolve() };
            })

            gltfLoader.load(castle, (object) => {
                object.scene.children[0].scale.set(.1, .1, .1);
                object.scene.children[0].traverse((child) => {
                    // @ts-ignore
                    if (child.isMesh) {
                        child.receiveShadow = true;
                        child.castShadow = true;
                    }
                })
                this.models.playerCastle = object.scene.children[0];
                if (--counter == 0) { resolve() };
            })

            gltfLoader.load(castle, (object) => {
                object.scene.children[0].scale.set(.1, .1, .1);
                object.scene.children[0].traverse((child) => {
                    // @ts-ignore
                    if (child.isMesh) {
                        child.receiveShadow = true;
                        child.castShadow = true;
                    }
                })
                this.models.enemyCastle = object.scene.children[0];
                if (--counter == 0) { resolve() };
            })

            gltfLoader.load(cannon, (object) => {
                object.scene.scale.set(3, 3, 3);
                object.scene.traverse((child) => {
                    // @ts-ignore
                    if (child.isMesh) {
                        child.receiveShadow = true;
                        child.castShadow = true;
                    }
                })
                this.models.cannon = object.scene;
                if (--counter == 0) { resolve() };
            })

            fbxLoader.load(playerFlag, (object) => {
                object.scale.set(.5,.5,.5);

                object.traverse((child) => {
                    // @ts-ignore
                    if (child.isMesh) {
                        child.receiveShadow = true;
                        child.castShadow = true;
                        child.material.forEach( material => {
                            if(material instanceof MeshPhongMaterial){
                                material.shininess = 1;
                                material.side = DoubleSide;
                            }
                        })
                    }
                })

                this.models.playerFlag = object;
                if (--counter == 0) { resolve() };
            });

            fbxLoader.load(enemyFlag, (object) => {
                object.scale.set(.5,.5,.5);

                object.traverse((child) => {
                    // @ts-ignore
                    if (child.isMesh) {
                        child.receiveShadow = true;
                        child.castShadow = true;
                        child.material.forEach( material => {
                            if(material instanceof MeshPhongMaterial){
                                material.shininess = 1;
                                material.side = DoubleSide;
                            }
                        })
                    }
                })

                this.models.enemyFlag = object;
                if (--counter == 0) { resolve() };
            });
        })
    }

    repeatMaterials() {
        for (const key in this.materials) {
            const material = this.materials[key];

            [
                material.map,
                material.aoMap,
                material.envMap,
                material.bumpMap,
                material.normalMap,
                material.roughnessMap,
                material.metalnessMap,
                material.displacementMap
            ].forEach(mat => {
                if (mat !== null) {
                    mat.repeat.set(1, 1);
                    mat.wrapS = mat.wrapT = RepeatWrapping;
                }
            });

        }
    }
}