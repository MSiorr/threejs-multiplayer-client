export default class PowerupItem {
    /**
     * @param {keyof import("./PowerupManager").Powerups} name
     * @param {String} imagePath
     * @param {1 | 2 | 3} tier
     * @param {number} activation in seconds
     * @param {number} duration in seconds
     * @param {Number} cooldown in seconds
     * @param {Function} onUseFunction
     * @param {function} globalCooldownFunction
     */
    constructor(name, imagePath, tier, activation, duration, cooldown, onUseFunction, globalCooldownFunction) {
        this.name = name;
        this.path = imagePath;
        this.tier = tier;
        this.activation = activation * 1000;
        this.cooldown = cooldown * 1000;
        this.duration = duration * 1000;
        this.activation = activation * 1000;
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