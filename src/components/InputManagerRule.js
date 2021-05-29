export default class {
    /**
     * @param {Function} handler
     * @param {string[]} triggers
     * @param {Boolean} allowHold
     * @param {number} [holdTime]
     */
    constructor(handler, triggers, allowHold, holdTime = 0) {
        this.handler = handler;
        this.triggers = triggers;
        this.allowHold = allowHold;
        this.holdTime = holdTime;
        this.task = null;
        this.pressed = false;
    }
}