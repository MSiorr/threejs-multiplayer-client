/**
         * @typedef {{
         * menu: HTMLElement,
         * title: HTMLElement,
         * lobby: HTMLElement,
         * waiting: HTMLElement,
         * startGame: HTMLElement}} MenuElements
         */
export default class Menu {
    constructor() {
        /**
         * @type {MenuElements}
         */
        this.html = {
            menu: null,
            title: null,
            lobby: null,
            waiting: null,
            startGame: null
        };

        this.initHTML();
    }

    initHTML() {
        this.html.menu = document.getElementById("menu");
        this.html.title = document.getElementById("title");
        this.html.lobby = document.getElementById("lobby");
        this.html.waiting = document.getElementById("waiting");
        this.html.startGame = document.getElementById("start-game");
    }

    /**
     * @param {keyof(MenuElements)} element 
     */
    show(element) {
        this.html[element].classList.add("active");
    }

    /**
     * @param {keyof(MenuElements)} element
     */
    hide(element) {
        this.html[element].classList.remove("active");
    }
}