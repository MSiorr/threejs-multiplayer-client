import { MeshPhongMaterial, TextureLoader } from "three";

//@ts-ignore
import grass_512_color from "../resources/textures/grass/grass_512_color.png";
//@ts-ignore
import grass_512_ao from "../resources/textures/grass/grass_512_ao.png";
//@ts-ignore
import grass_512_dis from "../resources/textures/grass/grass_512_dis.png";
//@ts-ignore
import grass_512_normal from "../resources/textures/grass/grass_512_normal.png";
//@ts-ignore
import grass_512_rough from "../resources/textures/grass/grass_512_rough.png";
//@ts-ignore
import playerModel from "../models/player.fbx";
//@ts-ignore
import playerWalk from "../models/player@walk.fbx";
//@ts-ignore
import playerIdle from "../models/player@idle.fbx";

import { FBXLoader } from "three/examples/jsm/loaders/fbxloader";

export default class Library {
    constructor() {
        this.textures = {
            grass_512_ao: new TextureLoader().load(grass_512_ao),
            grass_512_color: new TextureLoader().load(grass_512_color),
            grass_512_dis: new TextureLoader().load(grass_512_dis),
            grass_512_normal: new TextureLoader().load(grass_512_normal),
            grass_512_rough: new TextureLoader().load(grass_512_rough)
        }

        this.models = {
            playerModel: null,
            playerIdle: null,
            playerWalk: null
        }

        this.materials = {
            grassMaterial: new MeshPhongMaterial({
                aoMap: this.textures.grass_512_ao,
                map: this.textures.grass_512_color,
                // displacementMap: this.textures.grass_512_dis,
                normalMap: this.textures.grass_512_normal,
                bumpMap: this.textures.grass_512_rough
            })
        }

        this.LoadModels();
    }

    LoadModels(){
        let fbxLoader = new FBXLoader();
        fbxLoader.load(playerModel, (object) => {
            object.scale.set(.5, .5, .5)
            this.models.playerModel = object;
        })
        fbxLoader.load(playerIdle, (object) => {
            object.scale.set(.5, .5, .5)
            this.models.playerIdle = object;
        })
        fbxLoader.load(playerWalk, (object) => {
            object.scale.set(.5, .5, .5)
            this.models.playerWalk = object;
        })
    }
}