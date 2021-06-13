export default class PowerupItem {
    /**
     * @param {String} name
     * @param {String} imagePath
     * @param {Number} tier
     */
    constructor(name, imagePath, tier) {
        this.name = name;
        this.path = imagePath;
        this.tier = tier;
    }
}