import { BoxGeometry, BufferGeometry, Line, LineBasicMaterial, Mesh, MeshPhongMaterial, Vector3, Box3 } from 'three';

import config from './Config';

export default class extends Mesh {
    /**
     * @param {number} x
     * @param {number} z
     */
    constructor(x, z) {
        super(
            new BoxGeometry(config.blockSize, config.blockSize / 5, config.blockSize),
            new MeshPhongMaterial({
                color: 0xffff00
            })
        )

        this.receiveShadow = true;

        this.x = x;
        this.z = z;
    }

    createOutline() {
        let v1 = this.position.clone();
        let v2 = this.position.clone().add(new Vector3(config.blockSize, 0, 0));
        let v3 = this.position.clone().add(new Vector3(config.blockSize, 0, config.blockSize));
        let v4 = this.position.clone().add(new Vector3(0, 0, config.blockSize));
        let geometry = new BufferGeometry().setFromPoints([v1, v2, v3, v4, v1]);
        let material = new LineBasicMaterial({ color: 0x000000 });
        let mesh = new Line(geometry, material);

        //@ts-ignore
        let x = new Box3().setFromObject(this).getSize(new Vector3()).x;
        //@ts-ignore
        let y = new Box3().setFromObject(this).getSize(new Vector3()).y;
        //@ts-ignore
        let z = new Box3().setFromObject(this).getSize(new Vector3()).z;

        mesh.position.x -= x / 2;
        mesh.position.y += y / 2 + 1;
        mesh.position.z -= z / 2;
        this.add(mesh);
    }
}