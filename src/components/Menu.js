export default class Menu {
    constructor() {
        /**
         * @type {{menu: HTMLElement, title: HTMLElement, lobby: HTMLElement, waiting: HTMLElement}}
         */
        this.html = {
            menu: null,
            title: null,
            lobby: null,
            waiting: null
        };

        this.initHTML();
    }

    initHTML() {
        this.html.menu = document.getElementById("menu");
        this.html.title = document.getElementById("title");
        this.html.lobby = document.getElementById("lobby");
        this.html.waiting = document.getElementById("waiting");
    }

    /**
     * @param {"title" | "lobby" | "waiting"} element 
     */
    show(element) {
        this.html[element].classList.add("active");
    }

    /**
     * @param {"title" | "lobby" | "waiting"} element 
     */
    hide(element) {
        this.html[element].classList.remove("active");
    }
}