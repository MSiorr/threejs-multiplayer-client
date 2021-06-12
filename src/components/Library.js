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

export default class Library {
    constructor() {
        this.textures = {
            grass_512_ao: new TextureLoader().load(grass_512_ao),
            grass_512_color: new TextureLoader().load(grass_512_color),
            grass_512_dis: new TextureLoader().load(grass_512_dis),
            grass_512_normal: new TextureLoader().load(grass_512_normal),
            grass_512_rough: new TextureLoader().load(grass_512_rough)
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
    }
}