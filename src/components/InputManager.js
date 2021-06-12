import InputManagerRule from "./InputManagerRule.js";

export default class InputManager {
    /**
     * @param {Boolean[]} boolArrRef
     */
    constructor(boolArrRef) {
        this.boolArrRef = boolArrRef;

        /**
         * @type {{[x: string]: InputManagerRule}}
         */
        this.rules = {};
    }

    /**
     * @param {String[]} triggers - KeyboardEvent.code
     * @param {string} name
     * @param {Function} handler
     * @param {boolean} allowHold
     * @param {number} [holdTime]
     */
    Add(name, handler, triggers, allowHold, holdTime = 0) {
        let r = new InputManagerRule(handler, triggers, allowHold, holdTime)

        this.rules[name] = r;
    }

    RegisterEventCapture() {
        window.addEventListener("keydown", this.ParseKeyboardEvent.bind(this), false);
        window.addEventListener("keyup", this.ParseKeyboardEvent.bind(this), false);
    }

    /**
     * @param {KeyboardEvent} event
     */
    ParseKeyboardEvent(event) {
        for (const key in this.rules) {
            /**
             * @type {InputManagerRule}
             */
            let r = this.rules[key];

            if (r.triggers.includes(event.code)) {
                if (r.allowHold == true) {
                    if (event.type == "keydown" && r.task == null) {
                        if (this.boolArrRef[0] == true) {
                            r.handler();
                        } else {
                            this.ResetIntervals();
                        }

                        r.task = setInterval((handler) => {
                            if (this.boolArrRef[0] == true) {
                                handler();
                            } else {
                                this.ResetIntervals();
                            }
                        }, r.holdTime, r.handler);
                    } else if (event.type == "keyup" && r.task != null) {
                        clearInterval(r.task);

                        r.task = null;
                    }
                } else {
                    if (event.type == "keydown" && r.pressed == false) {
                        r.pressed = true;

                        if (this.boolArrRef[0] == true) {
                            r.handler();
                        } else {
                            this.ResetIntervals();
                        }
                    } else if (event.type == "keyup" && r.pressed == true) {
                        r.pressed = false;
                    }
                }
            }
        }
    }

    ResetIntervals() {
        for (const key in this.rules) {
            /**
             * @type {InputManagerRule}
             */
            let r = this.rules[key];

            if (r.allowHold == true) {
                clearInterval(r.task);
                r.task = null;
            } else {
                r.pressed = false;
            }
        }
    }
}