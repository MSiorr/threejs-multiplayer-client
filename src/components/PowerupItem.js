export default class PowerupItem {
    /**
     * @param {String} name
     * @param {String} imagePath
     * @param {Number} tier
     * @param {Number} cooldown in seconds
     */
    constructor(name, imagePath, tier, cooldown) {
        this.name = name;
        this.path = imagePath;
        this.tier = tier;
        this.cooldown = cooldown;

        this.nextActive = Date.now();
    }

    use() {
        this.nextActive = Date.now() + this.cooldown * 1000;

        return this.name;
    }
}