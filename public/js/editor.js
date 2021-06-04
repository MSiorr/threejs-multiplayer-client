/**
 * @typedef {{id: number, x: number, z: number, type: "floor" | "goal" | "block" | "player"}} levelItem
 * @typedef {{data: levelItem[], difficulty: "easy" | "medium" | "hard", id : number}} level
 */

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
    "restart": "black",
    "deleteLvl": "black"
}

let currentItem = null;

let mapList = null;
let outputTextArea = null;
let buttonsList = [
    { name: "Save/Update level on server", type: "action", value: "save" },
    { name: "Delete level from server", type: "action", value: "deleteLvl" },
    { name: "Restart", type: "action", value: "restart" },
    { name: "Floor", type: "item", clicked: false, value: "floor" },
    { name: "Player", type: "item", clicked: false, value: "player" },
    { name: "Block", type: "item", clicked: false, value: "block" },
    { name: "Goal", type: "item", clicked: false, value: "goal" },
    { name: "Delete", type: "item", clicked: false, value: "delete" }
]

let creatingNewLevel = true;
let currentEditingMapID = null;

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
                        // @ts-ignore
                        e.target.style.backgroundColor = currentItem.color;
                        arenaData[i][j] = {
                            id: (arenaSize * i) + j,
                            x: i,
                            z: j,
                            type: currentItem.item
                        }
                    } else {
                        // @ts-ignore
                        e.target.style.backgroundColor = "transparent";
                        arenaData[i][j] = null;
                    }
                    outputData = [];
                    arenaData.forEach(e => {
                        e.forEach((/** @type {any} */ k) => {
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
            // @ts-ignore
            el.target.style.backgroundColor = colors[e.value];
            if (colors[e.value] === "white" || colors[e.value] === "#e2e225") {
                // @ts-ignore
                el.target.style.color = "black";
            }
        }
        /**
         * @param {MouseEvent} el 
         */
        button.onmouseout = (el) => {
            if (e.clicked === false || e.clicked === undefined) {
                // @ts-ignore
                el.target.style.backgroundColor = "transparent";
                if (colors[e.value] === "white" || colors[e.value] === "#e2e225") {
                    // @ts-ignore
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
                // @ts-ignore
                el.target.style.backgroundColor = colors[e.value];
                if (colors[e.value] === "white" || colors[e.value] === "#e2e225") {
                    // @ts-ignore
                    el.target.style.color = "black";
                }
            } else {

                switch (e.value) {
                    case "save": {
                        if (outputData.length > 0) {
                            saveFetch(outputData)
                        }
                        break;
                    }
                    case "restart": {
                        createMapList();
                        break;
                    }
                    case "deleteLvl": {
                        deleteLvl();
                        break;
                    }
                }
            }

            /**
             * @param {any[]} arenaData
             */
            async function saveFetch(arenaData) {
                let difficultyVal = await createSelectPrompt();
                console.log(difficultyVal);

                let firstX = arenaData[0].x;
                let firstZ = arenaData[0].z;

                arenaData.forEach((/** @type {{ x: number; z: number; }} */ e) => {
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
                    difficulty: difficultyVal,
                    data: arenaData
                })

                if (creatingNewLevel == true) {
                    fetch("https://progetto-stefanetto.herokuapp.com/level/", {
                        method: "POST",
                        headers: {
                            'Content-Type': "application/json"
                        },
                        body: data
                    })
                        .then(response => response.text())
                        .then(data => {
                            alert(data)
                            creatingNewLevel = true;
                            currentEditingMapID = null;
                            createMapList();
                            readLoadedData([]);
                        })
                } else {

                    if (currentEditingMapID != null) {
                        fetch(`https://progetto-stefanetto.herokuapp.com/level/${currentEditingMapID}`, {
                            method: "PUT",
                            headers: {
                                'Content-Type': "application/json"
                            },
                            body: data
                        })
                            .then(response => response.text())
                            .then(data => {
                                alert(data)
                                createMapList();
                            })
                    } 
                }

            }

            function deleteLvl(){
                if (currentEditingMapID != null) {
                    fetch(`https://progetto-stefanetto.herokuapp.com/level/${currentEditingMapID}`, {
                        method: "DELETE"
                    })
                        .then(response => response.text())
                        .then(data => {
                            alert(data)
                            creatingNewLevel = true;
                            currentEditingMapID = null;
                            createMapList();
                            readLoadedData([]);
                        })
                } else {
                    alert("Choose map first!")
                }
            }
        }

        menu.appendChild(button);
        btnTable.push(button);
    })
    right.appendChild(menu);

}

function createOutputData() {

    createMapList();

    let outputTextAreaDiv = document.createElement("div")
    outputTextAreaDiv.id = "outputTextAreaDiv";

    outputTextArea = document.createElement("textarea");
    outputTextArea.id = "outputTextArea";
    outputTextArea.readOnly = true;
    outputTextArea.value = JSON.stringify(outputData, null, 4)
    outputTextAreaDiv.appendChild(outputTextArea);

    let copyJSONBtn = document.createElement("button");
    copyJSONBtn.id = "copyJSONBtn";
    copyJSONBtn.innerText = "Copy"
    outputTextAreaDiv.appendChild(copyJSONBtn);

    copyJSONBtn.onclick = (e) => {
        let fastTextArea = document.createElement("textarea");
        fastTextArea.classList.add("fastTextArea");
        fastTextArea.value = JSON.stringify(outputData);
        document.body.appendChild(fastTextArea);
        fastTextArea.select();
        document.execCommand('copy')
        document.body.removeChild(fastTextArea);
    }

    left.appendChild(outputTextAreaDiv);
}

function createMapList() {
    if (mapList == null) {
        mapList = document.createElement("div");
        mapList.id = "mapList";
        left.appendChild(mapList);
    } else {
        mapList.innerHTML = "";
    }

    fetch("https://progetto-stefanetto.herokuapp.com/level/all", {
        method: "GET",
    })
        .then(response => response.json())
        .then((/** @type {level[]} */ data) => {
            
            let sortedArray = [];
            let difficultyList = ["easy", "medium", "hard"];
            difficultyList.forEach( e => {
                data.forEach( m => {
                    if(m.difficulty == e){
                        sortedArray.push(m);
                    }
                })
            })

            data = JSON.parse(JSON.stringify(sortedArray));

            for (let i = 0; i < data.length; i++) {
                let mapListItem = document.createElement("div");
                mapListItem.classList.add("mapListItem");

                let leftMapListItemDiv = document.createElement("div");
                leftMapListItemDiv.classList.add("leftMapListItemDiv")
                mapListItem.appendChild(leftMapListItemDiv);

                let rightMapListItemDiv = document.createElement("div");
                rightMapListItemDiv.classList.add("rightMapListItemDiv")
                mapListItem.appendChild(rightMapListItemDiv);

                let mapMiniature = createMapMiniature(data[i].data, 12);
                leftMapListItemDiv.appendChild(mapMiniature);

                let mapDifficulty = document.createElement("span");
                mapDifficulty.innerText = `${data[i].difficulty[0].toUpperCase()}${data[i].difficulty.substr(1)}`;
                mapDifficulty.classList.add("mapDifficulty");
                mapDifficulty.classList.add(`diff${mapDifficulty.innerText}`);
                rightMapListItemDiv.appendChild(mapDifficulty);

                mapListItem.onclick = () => {
                    creatingNewLevel = false;
                    currentEditingMapID = data[i].id;
                    readLoadedData(data[i].data);
                }

                mapList.appendChild(mapListItem);
            }
        })
}

function createMapMiniature(data, blockSize) {

    let mapMiniature = document.createElement("canvas");
    mapMiniature.width = 10 * blockSize;
    mapMiniature.height = 10 * blockSize;
    mapMiniature.classList.add("mapMiniature");

    let ctx = mapMiniature.getContext("2d");

    data.forEach((/** @type {levelItem} */ e) => {
        let x = e.x * blockSize + 1;
        let z = e.z * blockSize + 1;
        let width = blockSize - 2;
        let height = blockSize - 2;
        let color = colors[e.type];

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.rect(x, z, width, height)
        ctx.fill();
        ctx.closePath();
    })

    return mapMiniature
}

function readLoadedData(data) {
    arenaFields.forEach(e => {
        e.forEach((i) => {
            i.removeAttribute("style");
        })
    })
    for (let i = 0; i < arenaData.length; i++) {
        for (let j = 0; j < arenaData[i].length; j++) {
            arenaData[i][j] = null;
        }
    }
    data.forEach((e) => {
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
        e.forEach((k) => {
            if (k != null) {
                outputData.push(k);
            }
        })
    })
    outputTextArea.value = JSON.stringify(outputData, null, 4)

    console.log(currentEditingMapID);
}

function createSelectPrompt(){
    return new Promise( (resolve, reject) => {
        let selectPromptMainDiv = document.createElement("div");
        selectPromptMainDiv.id = "selectPromptMainDiv";
    
        let blackDiv = document.createElement("div");
        blackDiv.id = "blackDiv";
    
        let promptDiv = document.createElement("div");
        promptDiv.id = "promptDiv";
        
        let promptTitle = document.createElement("span");
        promptTitle.id = "promptTitle"
        promptTitle.innerText = "Choose level difficulty:"
    
        let promptSelect = document.createElement("select");
        promptSelect.id = "promptSelect";
    
        let difficultyTypes = ["easy", "medium", "hard"];
    
        difficultyTypes.forEach( e => {
            let option = document.createElement("option");
            option.value = e;
            option.innerText = e;
            promptSelect.appendChild(option);
        })
    
        let confirmBtn = document.createElement("button");
        confirmBtn.id = "confirmBtn";
        confirmBtn.innerText = "Confirm";
    
        promptDiv.appendChild(promptTitle);
        promptDiv.appendChild(promptSelect);
        promptDiv.appendChild(confirmBtn);
    
        selectPromptMainDiv.appendChild(blackDiv);
        selectPromptMainDiv.appendChild(promptDiv);
    
        document.body.appendChild(selectPromptMainDiv);
    
        confirmBtn.onclick = (e) => {
            document.body.removeChild(selectPromptMainDiv);
            resolve(promptSelect.value);
        }
    })

}