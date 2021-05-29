import { DirectionalLight, DirectionalLightHelper, Mesh, MeshBasicMaterial, SphereGeometry } from "three";

export default class extends DirectionalLight {
    constructor() {
        super(0xffffff, 1);

        this.castShadow = true;

        let size = 1024;

        this.shadow.mapSize.width = 1024;
        this.shadow.mapSize.height = 1024;
        this.shadow.camera.near = 512;
        this.shadow.camera.far = 2048;
        this.shadow.camera.left = -size;
        this.shadow.camera.right = size;
        this.shadow.camera.top = -size;
        this.shadow.camera.bottom = size;


        this.add(new Mesh(
            new SphereGeometry(20, 20, 20),
            new MeshBasicMaterial({ color: 0xff0000, wireframe: true })
        ))
    }
}