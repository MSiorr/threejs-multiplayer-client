import { testLevel } from "./testLevel.js";

window.addEventListener("load", () => {
    // vars
    let boardSize = 10;
    let currentTile = null;
    let fields = [];

    const tilesTypes = ["wall", "enemy", "treasure", "light"];

    /**
     * @typedef {Object} level
     * @property {number} size
     * @property {tile[]} data
     */

    /**
     * @typedef {Object} tile
     * @property {number} id
     * @property {number} x
     * @property {number} y
     * @property {number} z
     * @property {"wall" | "enemy" | "treasure" | "light"} type
     */

    /**
     * @type {tile[]}
     */
    let level = [];

    // DOM handles
    let board = document.getElementById("board");
    let outputJSON = document.getElementById("json");
    outputJSON.innerHTML = JSON.stringify(level, null, 4);

    /**
     * @type {NodeListOf<HTMLElement>}
     */
    let tiles = document.querySelectorAll("#tiles .tile");
    let buttons = document.querySelectorAll("#buttons .button");


    // create board
    for (let y = 0; y < boardSize; y++) {
        for (let x = 0; x < boardSize; x++) {
            let d = document.createElement("div");

            d.classList.add("field");

            d.dataset["id"] = (y * boardSize + x).toString();

            d.addEventListener("click", (e) => { ModifyBoard(e); })

            fields.push(d);
            board.append(d);
        }
    }

    board.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
    board.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;


    // register tiles events
    tiles.forEach(tile => {
        tile.addEventListener("click", (e) => {
            //@ts-ignore
            SelectTile(e.currentTarget);
        });
    });

    // register buttons events
    buttons.forEach(button => {
        button.addEventListener("click", (e) => {
            //@ts-ignore
            ResolveAction(e.currentTarget);
        });
    });

    /**
     * 
     * @param {HTMLElement} tile 
     */
    function SelectTile(tile) {
        tiles.forEach(tile => {
            tile.classList.remove("selected");
        });

        tile.classList.add("selected");
        currentTile = tile.dataset["tile"];
    }


    // board event

    function ModifyBoard(e) {
        if (currentTile != null) {
            e.currentTarget.classList.remove(...tilesTypes);

            let id = parseInt(e.currentTarget.dataset["id"]);

            if (currentTile != "delete") {
                e.currentTarget.classList.add(currentTile);

                /**
                 * @type {tile}
                 */
                let tile = {
                    id: id,
                    x: id % boardSize,
                    y: 0,
                    z: Math.floor(id / boardSize),
                    type: currentTile
                }

                DeleteFromBoard(id);
                AddToBoard(tile);
            } else {
                DeleteFromBoard(id);
            }

            level.sort((a, b) => {
                return a.id - b.id;
            });

            outputJSON.innerHTML = JSON.stringify(level, null, 4);
        } else {
            alert("Please select a tile first!");
        }
    }

    /**
     * @param {number} id 
     */
    function DeleteFromBoard(id) {
        let pos = -1;

        for (let i = 0; i < level.length; i++) {
            if (level[i].id == id) {
                pos = i;
                break;
            }
        }

        if (pos == -1) {
            return;
        }

        level.splice(pos, 1);
    }


    /**
     * @param {tile} tile
     */
    function AddToBoard(tile) {
        for (let i = 0; i < level.length; i++) {
            if (level[i].id == tile.id) {
                return
            }
        }

        level.push(tile);
    }

    /**
     * @param {HTMLDivElement} element 
     */
    function ResolveAction(element) {
        let action = element.dataset["action"];

        let o = {
            save: Save,
            load: Load,
            test: Test
        }

        o[action]();
    }

    function Save(data = level) {
        fetch("/level", {
            method: "POST", body: JSON.stringify(data), headers: {
                "Content-Type": "application/json"
            }
        })
            .then(() => {
                console.log("yay");
            })
    }

    function Load() {
        fetch("/level", { method: "GET" })
            .then(response => response.json())
            .then(data => {
                BuildLevel(data);
                tiles = data.data
                outputJSON.innerHTML = JSON.stringify(tiles, null, 4);
            })
    }


    /**
     * @param {level} data
     */
    function BuildLevel(data) {
        //! account for change in size

        fields.forEach(el => {
            el.classList.remove(...tilesTypes);
        });

        data.data.forEach(tile => {
            fields[tile.id].classList.add(tile.type);
        });
    }

    function Test() {
        Save(JSON.parse(testLevel));
    }
});