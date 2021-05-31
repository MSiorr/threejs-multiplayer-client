import { Euler, Vector3 } from "three";

export default class Utility {
    /**
     * @param {Vector3} vector
     * @param {Vector3} point
     * @param {Euler} rotation
     * @returns {Vector3}
     */
    static rotateVectorAroundPoint(vector, point, rotation) {
        let v = vector.clone();
        let p = point.clone();
        let r = rotation.clone();

        v.sub(p);
        v.applyEuler(r);
        v.add(p);

        return v;
    }
}