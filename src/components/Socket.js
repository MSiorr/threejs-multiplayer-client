import SocketRule from "./SocketRule";

export default class {
    constructor(){
        this.ws = new WebSocket("wss://progetto-stefanetto.herokuapp.com/wss"); 
        
        /**
         * @type {{ [title:string] : SocketRule}}
         */
        this.socketsSubscriptions = {};

        this.AddFunctionality();
    }

    AddFunctionality(){
        this.ws.onopen = () => {
            // this.ws.send("HI GUYS, I'M THERE")
        }

        this.ws.onerror = (e) => {
            // @ts-ignore
            console.log(e.message);
        }

        this.ws.onclose = (e) => {
            console.log(e.code, e.reason);
        }

        this.ws.onmessage = (e) => {
            console.log(e.data)
            let message = JSON.parse(e.data);
            for(let title in this.socketsSubscriptions){
                if(title == message.title){
                    console.log("Wywołanie funkcji z tytułu " + title)
                    this.socketsSubscriptions[title].handler(message.data);
                }
            }
        }
    }

    /**
     * @param {string} title
     * @param {Function} fun
     */
    Add(title, fun){
        let rule = new SocketRule(fun);

        this.socketsSubscriptions[title] = rule;
    }

    /**
     * @param {any} data
     */
    Send(data){
        this.ws.send(JSON.stringify(data));
    }
}