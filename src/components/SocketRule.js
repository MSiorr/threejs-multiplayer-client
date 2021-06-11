export default class SocketRule {
    /**
     * @param {Function} handler
     */
    constructor(handler) {
        this.handler = handler;
    }
}