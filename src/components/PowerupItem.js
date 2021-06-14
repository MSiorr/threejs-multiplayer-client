export default class PowerupItem {
    /**
     * @param {keyof import("./PowerupManager").Powerups} name
     * @param {String} imagePath
     * @param {1 | 2 | 3} tier
     * @param {Number} cooldown in seconds
     * @param {number} duration
     * @param {Function} onUseFunction
     * @param {function} globalCooldownFunction
     */
    constructor(name, imagePath, tier, cooldown, duration, onUseFunction, globalCooldownFunction) {
        this.name = name;
        this.path = imagePath;
        this.tier = tier;
        this.cooldown = cooldown * 1000;
        this.duration = duration * 1000;
        this.onUseFunction = onUseFunction;
        this.globalCooldownFunction = globalCooldownFunction;

        this.nextActive = Date.now();
    }

    use(globalCooldown = true) {
        this.nextActive = Date.now() + this.cooldown;

        if (globalCooldown) {
            this.globalCooldownFunction();
        }

        return this.onUseFunction(this);
    }

    reset() {
        this.nextActive = Date.now() + this.cooldown;
    }
}