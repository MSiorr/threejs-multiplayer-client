let left = document.querySelector("#left");
let center = document.querySelector("#center");
let right = document.querySelector("#right");

let arenaSize = 10;
let arenaData = [];
let arenaFields = [];
let outputData = [];
let testLevel = '[{"id":15,"x":1,"z":5,"type":"floor"},{"id":16,"x":1,"z":6,"type":"floor"},{"id":25,"x":2,"z":5,"type":"floor"},{"id":26,"x":2,"z":6,"type":"floor"},{"id":33,"x":3,"z":3,"type":"floor"},{"id":35,"x":3,"z":5,"type":"floor"},{"id":36,"x":3,"z":6,"type":"player"},{"id":43,"x":4,"z":3,"type":"goal"},{"id":45,"x":4,"z":5,"type":"floor"},{"id":46,"x":4,"z":6,"type":"floor"},{"id":53,"x":5,"z":3,"type":"goal"},{"id":54,"x":5,"z":4,"type":"floor"},{"id":55,"x":5,"z":5,"type":"block"},{"id":56,"x":5,"z":6,"type":"floor"},{"id":63,"x":6,"z":3,"type":"floor"},{"id":64,"x":6,"z":4,"type":"floor"},{"id":65,"x":6,"z":5,"type":"floor"},{"id":66,"x":6,"z":6,"type":"player"},{"id":73,"x":7,"z":3,"type":"floor"},{"id":74,"x":7,"z":4,"type":"floor"},{"id":75,"x":7,"z":5,"type":"floor"},{"id":76,"x":7,"z":6,"type":"floor"}]';

let colors = {
    "floor": "#21ae21",
    "player": "#c42121",
    "block": "#000a31",
    "goal": "#e2e225",
    "delete": "white",
    "save": "black",
    "saveTest": "black",
    "load": "black"
}

let currentItem = null;

let outputTextArea = null;
let buttonsList = [
    { name: "Save level on server", type: "action", value: "save" },
    { name: "Save test level on server", type: "action", value: "saveTest" },
    { name: "Load level from server", type: "action", value: "load" },
    { name: "Floor", type: "item", clicked: false, value: "floor" },
    { name: "Player", type: "item", clicked: false, value: "player" },
    { name: "Block", type: "item", clicked: false, value: "block" },
    { name: "Goal", type: "item", clicked: false, value: "goal" },
    { name: "Delete", type: "item", clicked: false, value: "delete" }
]

createArena();
createMenuButtons();
createOutputData();

function createArena() {
    let arena = document.createElement("div");
    arena.id = "arena";
    for (let i = 0; i < arenaSize; i++) {
        let arenaColumn = document.createElement("div");
        arenaColumn.classList.add("arenaColumn");
        arenaData.push([]);
        arenaFields.push([]);
        for (let j = 0; j < arenaSize; j++) {
            let field = document.createElement("div");
            field.classList.add("field");

            field.onclick = (e) => {
                if (currentItem != null) {
                    if (currentItem.item !== "delete") {
                        e.target.style.backgroundColor = currentItem.color;
                        arenaData[i][j] = {
                            id: (arenaSize * i) + j,
                            x: i,
                            z: j,
                            type: currentItem.item
                        }
                    } else {
                        e.target.style.backgroundColor = "transparent";
                        arenaData[i][j] = null;
                    }
                    outputData = [];
                    arenaData.forEach(e => {
                        e.forEach(k => {
                            if (k != null) {
                                outputData.push(k);
                            }
                        })
                    })
                    outputTextArea.value = JSON.stringify(outputData, null, 4)
                } else {
                    alert("Choose item first!")
                }
            }
            arenaData[i][j] = null;
            arenaFields[i][j] = field;
            arenaColumn.appendChild(field);
        }
        arena.appendChild(arenaColumn);
    }
    center.appendChild(arena);
}

function createMenuButtons() {
    let moveToItem = false;
    console.log("BG")
    let btnTable = [];
    let menu = document.createElement("div");
    menu.id = "menu";
    buttonsList.forEach(e => {
        let button = document.createElement("div");
        button.classList.add("menuButton");
        button.innerText = e.name;
        button.style.border = `4px solid ${colors[e.value]}`
        if (e.type === "item" && moveToItem === false) {
            moveToItem = true;
            button.style.margin = "50px 0 0 0";
        }

        button.onmouseover = (el) => {
            el.target.style.backgroundColor = colors[e.value];
            if (colors[e.value] === "white" || colors[e.value] === "#e2e225") {
                el.target.style.color = "black";
            }
        }
        /**
         * @param {MouseEvent} el 
         */
        button.onmouseout = (el) => {
            if (e.clicked === false || e.clicked === undefined) {
                el.target.style.backgroundColor = "transparent";
                if (colors[e.value] === "white" || colors[e.value] === "#e2e225") {
                    el.target.style.color = "white";
                }
            }
        }
        button.onclick = (el) => {
            if (e.type === "item") {
                btnTable.forEach(i => {
                    i.style.backgroundColor = "transparent";
                    i.style.color = "white";
                })
                buttonsList.forEach(i => {
                    i.clicked = false;
                })
                e.clicked = !e.clicked;
                currentItem = { item: e.value, color: colors[e.value] };
                el.target.style.backgroundColor = colors[e.value];
                if (colors[e.value] === "white" || colors[e.value] === "#e2e225") {
                    el.target.style.color = "black";
                }
            } else {

                switch (e.value) {
                    case "save": {
                        // let json = JSON.stringify({
                        //     size: arenaSize,
                        //     data: outputData
                        // })
                        if (outputData.length > 0) {
                            saveFetch(outputData)
                        }
                        break;
                    }
                    case "saveTest": {
                        // let json = JSON.stringify({
                        //     size: arenaSize,
                        //     data: JSON.parse(testLevel)
                        // })
                        saveFetch(JSON.parse(testLevel))
                        break;
                    }
                    case "load": {
                        fetch("/level", { method: "GET" })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data);
                                readLoadedData(data.data)
                            })
                        break;
                    }
                }
            }

            function saveFetch(arenaData) {
                let firstX = arenaData[0].x;
                let firstZ = arenaData[0].z;

                arenaData.forEach(e => {
                    if (firstX == null) {
                        firstX = e.x
                    }
                    if (firstZ == null) {
                        firstZ = e.z
                    }
                    if (firstX > e.x) {
                        firstX = e.x
                    }
                    if (firstZ > e.z) {
                        firstZ = e.z
                    }
                })

                for (let i = 0; i < arenaData.length; i++) {
                    arenaData[i].x = arenaData[i].x - firstX;
                    arenaData[i].z = arenaData[i].z - firstZ;
                    arenaData[i].id = (arenaSize * arenaData[i].x) + arenaData[i].z
                }

                let data = JSON.stringify({
                    size: arenaSize,
                    data: arenaData
                })

                fetch("/level", {
                    method: "POST",
                    headers: {
                        'Content-Type': "application/json"
                    },
                    body: data
                })
                    .then(response => response.text())
                    .then(data => {
                        alert(data)
                    })
            }

            function readLoadedData(data) {
                arenaFields.forEach(e => {
                    e.forEach(i => {
                        i.removeAttribute("style");
                    })
                })
                for (let i = 0; i < arenaData.length; i++) {
                    for (let j = 0; j < arenaData[i].length; j++) {
                        arenaData[i][j] = null;
                    }
                }
                data.forEach(e => {
                    arenaFields[e.x][e.z].style.backgroundColor = colors[e.type];
                    arenaData[e.x][e.z] = {
                        id: e.id,
                        x: e.x,
                        z: e.z,
                        type: e.type
                    }
                })
                outputData = [];
                arenaData.forEach(e => {
                    e.forEach(k => {
                        if (k != null) {
                            outputData.push(k);
                        }
                    })
                })
                outputTextArea.value = JSON.stringify(outputData, null, 4)
            }
        }

        menu.appendChild(button);
        btnTable.push(button);
    })
    right.appendChild(menu);

}

function createOutputData() {
    outputTextArea = document.createElement("textarea");
    outputTextArea.id = "outputTextArea";
    outputTextArea.readOnly = true;
    outputTextArea.value = JSON.stringify(outputData, null, 4)
    left.appendChild(outputTextArea);
}

/*
TODO
- Klient WebGL
*/