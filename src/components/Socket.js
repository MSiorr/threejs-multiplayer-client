export default class Socket{
    constructor(){
        this.ws = new WebSocket("wss://progetto-stefanetto.herokuapp.com/wss"); 
        
        this.socketsSubscriptions = [];

        // this.AddFunctionality();
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
            let message = JSON.parse(e.data);
            for(let i = 0; i < this.socketsSubscriptions.length; i++) {
                if(this.socketsSubscriptions[i] == message.title){
                    console.log("Wywołanie funkcji " + message.title);
                }
            }
        }
    }
}