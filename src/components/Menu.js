/**
         * @typedef {{
         * menu: HTMLElement,
         * sceneCanvas: HTMLCanvasElement,
         * title: HTMLElement,
         * lobby: HTMLElement,
         * startsSoon: HTMLElement,
         * roomTransition: HTMLElement,
         * win: HTMLElement,
         * lose: HTMLElement,
         * startGame: HTMLElement}} MenuElements
         */
export default class Menu {
    constructor() {
        /**
         * @type {MenuElements}
         */
        this.html = {
            menu: null,
            sceneCanvas: null,
            title: null,
            lobby: null,
            startsSoon: null,
            roomTransition: null,
            startGame: null,
            win: null,
            lose: null
        };

        this.initHTML();
    }

    initHTML() {
        this.html.menu = document.getElementById("menu");
        this.html.sceneCanvas = document.querySelector("#menu canvas");
        this.html.title = document.getElementById("title");
        this.html.lobby = document.getElementById("lobby");
        this.html.startsSoon = document.getElementById("starts-soon");
        this.html.roomTransition = document.getElementById("room-transition");
        this.html.startGame = document.getElementById("start-game");
        this.html.win = document.getElementById("win");
        this.html.lose = document.getElementById("lose");
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

    /**
     * @param {keyof(MenuElements)} element
     * @param {String} content
     */
    edit(element, content) {
        this.html[element].innerHTML = content;
    }
}