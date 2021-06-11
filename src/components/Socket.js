import Config from "./Config";
import SocketRule from "./SocketRule";

export default class Socket {
    constructor() {
        this.ws = new WebSocket(`wss://${Config.hostname}/wss`);

        /**
         * @type {{ [title:string] : SocketRule}}
         */
        this.socketsSubscriptions = {};

        this.AddFunctionality();
        this.heartbeat();
    }

    AddFunctionality() {
        this.ws.onopen = () => {
            // this.ws.send("HI GUYS, I'M THERE")
        }

        this.ws.onerror = (e) => {
            // @ts-ignore
            console.log("ERROR", e.message);
        }

        this.ws.onclose = (e) => {
            console.log("CLOSE", e.code, e.reason);
        }

        this.ws.onmessage = (e) => {
            console.log("MESSAGE", e.data);
            let message = JSON.parse(e.data);

            for (let title in this.socketsSubscriptions) {
                if (title === message.title) {
                    console.log("TITLE", title)
                    console.log("MESSAGE", message.data)
                    this.socketsSubscriptions[title].handler(JSON.parse(message.data));
                }
            }
        }
    }

    /**
     * @param {string} title
     * @param {Function} fun
     */
    Add(title, fun) {
        let rule = new SocketRule(fun);

        this.socketsSubscriptions[title] = rule;
    }

    /**
     * @param {{title: String, data: String}} data
     */
    Send(data) {
        this.ws.send(JSON.stringify(data));
    }

    /**
     * @param {string} title
     * @param {string} [data]
     */
    createMessage(title, data = "") {
        return { title, data };
    }

    heartbeat() {
        if (this.ws.readyState === this.ws.OPEN) {
            this.Send(this.createMessage("heartbeat"));
            console.log("HEARTBEAT");
        }

        setTimeout(() => {
            this.heartbeat();
        }, 5000);
    }
}