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

    /**
     * @param {number} v
     * @param {number} min
     * @param {number} max
     */
    static clamp(v, min, max) {
        return Math.min(Math.max(v, min), max);
    }

    /**
     * @param {0|1|2|3|4} v
     * @param {number} x
     */
    static michal(v, x) {
        return Math.min(v, 4 - v) * x;
    }
}