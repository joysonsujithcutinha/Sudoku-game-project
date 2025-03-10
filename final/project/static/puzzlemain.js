document.addEventListener('DOMContentLoaded', () => {
    
    const grid = document.getElementById('sudoku-grid');
    if (grid === null) {
        return;
    }
    if (document.body.getAttribute('puzzletype') == 'xyz'){
        // const puzzleType = document.body.getAttribute('puzzletype')
        return;
    }
    let gridSize, rowSize, colSize;
    [gridSize, rowSize, colSize] = getSizes();

    // Create the grid
    for (let row = 0; row < gridSize; row++) {
        const tr = document.createElement('tr');
        for (let col = 0; col < gridSize; col++) {
            const td = document.createElement('td');
            td.setAttribute('contenteditable', true);
            tr.appendChild(td);
        }
        grid.appendChild(tr);
    }

    // Apply styles
    const cells = grid.querySelectorAll('td');
    cells.forEach((cell, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        if ((col + 1) % colSize === 0) cell.style.borderRight = '2px solid #141313';
        if ((row + 1) % rowSize === 0) cell.style.borderBottom = '2px solid #0b0b0b';
        if (row % rowSize === 0) cell.style.borderTop = '2px solid #0b0b0b';
        if (col % colSize === 0) cell.style.borderLeft = '2px solid #0b0b0b';
    });

    grid.addEventListener('input', handleInput);
    grid.addEventListener('keydown', handleKeyDown);

    _fillGame(puzzlegrid);

    // Initialize stopwatch
    startStopwatch();

    // Add event listeners for buttons
    document.getElementById('reset').addEventListener('click', resetGame);
    document.getElementById('pause').addEventListener('click', togglePause);
    document.getElementById('new-game').addEventListener('click', submitform);


});

let stopwatchInterval;
let elapsedTime = 0;
let isPaused = false;

function startStopwatch() {
    const stopwatchElement = document.getElementById('stopwatch');
    stopwatchInterval = setInterval(() => {
        if (!isPaused) {
            elapsedTime++;
            const hours = String(Math.floor(elapsedTime / 3600)).padStart(2, '0');
            const minutes = String(Math.floor((elapsedTime % 3600) / 60)).padStart(2, '0');
            const seconds = String(elapsedTime % 60).padStart(2, '0');
            stopwatchElement.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }, 1000);
}


function resetGame() {
    const cells = Array.from(document.querySelectorAll('#sudoku-grid td'));

    // Clear only user-entered values
    cells.forEach(cell => {
        if (cell.getAttribute('data-initial-value') === null) {
            cell.textContent = '';  // Clear user-entered values
            cell.style.backgroundColor = 'white';  // Reset background color
            cell.style.fontWeight = 'normal';  // Reset font weight
        }
    });

    // Reset the grid's visual state
    validateGrid(); // This will remove any previous error highlights
}

function togglePause() {
    isPaused = !isPaused;
    console.log('Paused:', isPaused); // Add this line for debugging
    const pauseButton = document.getElementById('pause');
    const pauseOverlay = document.getElementById('pause-overlay');
    const cells = document.querySelectorAll('#sudoku-grid td');

    if (isPaused) {
        pauseOverlay.style.display = 'flex';
        cells.forEach(cell => cell.style.visibility = 'hidden');
        pauseButton.textContent = 'Resume';
    } else {
        pauseOverlay.style.display = 'none';
        cells.forEach(cell => cell.style.visibility = 'visible');
        pauseButton.textContent = 'Pause';
    }
}

function getSizes() {
    const puzzleType = document.body.getAttribute('puzzletype');
    let gridSize, rowSize, colSize;
    switch (puzzleType) {
        case '4x4': gridSize = 4; rowSize = colSize = 2; break;
        case '6x6': gridSize = 6; rowSize = 2; colSize = 3; break;
        case '9x9': gridSize = 9; rowSize = colSize = 3; break;
        default: console.error('Unsupported puzzle type'); return;
    }
    return [gridSize, rowSize, colSize];
}

function handleInput(event) {
    const cell = event.target;
    if (cell.tagName.toLowerCase() === 'td') {
        validateCell(cell);
        validateGrid();
    }
}

function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === 'Tab' || event.key === "ArrowLeft" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        const cell = event.target;
        if (cell.tagName.toLowerCase() === 'td') {
            moveToNextCell(cell, event.key);
        }
    }
}

function validateCell(cell) {
    const value = cell.textContent.trim();
    let gridSize, rowSize, colSize;
    [gridSize, rowSize, colSize] = getSizes();
    const re = new RegExp('^[1-' + gridSize + ']$');
    if (value && re.test(value)) {
        cell.textContent = value;
    } else {
        cell.textContent = '';
    }
}

function moveToNextCell(currentCell, key) {
    const cells = Array.from(document.querySelectorAll('#sudoku-grid td'));
    let index = cells.indexOf(currentCell);
    const gridSize = Math.sqrt(cells.length);
    let index1 = index;
    do {
        index = index1;
        if (index !== -1) {
            if (key === 'Enter' || key === 'Tab') {
                index1 = index + 1;
                if (index1 === cells.length) {
                    index1 = 0;
                }
            } else if (key === "ArrowLeft") {
                index1 = index - 1;
                let rowIndex = Math.floor(index / gridSize);
                let rowIndex1 = Math.floor(index1 / gridSize);
                if (rowIndex1 !== rowIndex) {
                    index1 = index1 + gridSize;
                }
            } else if (key === "ArrowRight") {
                index1 = index + 1;
                let rowIndex = Math.floor(index / gridSize);
                let rowIndex1 = Math.floor(index1 / gridSize);
                if (rowIndex1 !== rowIndex) {
                    index1 = index1 - gridSize;
                }
            } else if (key === "ArrowUp") {
                index1 = index - gridSize;
                if (index1 < 0) {
                    index1 = index1 + cells.length;
                }
            } else if (key === "ArrowDown") {
                index1 = index + gridSize;
                if (index1 > cells.length - 1) {
                    index1 = index1 - cells.length;
                }
            }
        } 
    } while(cells[index1].getAttribute('contenteditable')==='false');
    const nextCell = cells[index1];
    if (nextCell) nextCell.focus();
}

function validateGrid() {
    const cells = Array.from(document.querySelectorAll('#sudoku-grid td'));
    const gridSize = Math.sqrt(cells.length);
    const rowSize = Math.floor(Math.sqrt(gridSize));
    const colSize = gridSize / rowSize;
    // Clear previous highlights
    cells.forEach(cell => cell.style.backgroundColor = 'white');

    function getBlockCells(row, col) {
        const startRow = Math.floor(row / rowSize) * rowSize;
        const startCol = Math.floor(col / colSize) * colSize;
        let blockCells = [];
        for (let r = startRow; r < startRow + rowSize; r++) {
            for (let c = startCol; c < startCol + colSize; c++) {
                blockCells.push(cells[r * gridSize + c]);
            }
        }
        return blockCells;
    }

    function checkForDuplicates(cells) {
        const seen = new Map();
        cells.forEach(cell => {
            const value = cell.textContent.trim();
            if (value && /^[1-9]$/.test(value)) {
                if (!seen.has(value)) {
                    seen.set(value, []);
                }
                seen.get(value).push(cell);
            }
        });
        return seen;
    }

    function highlightDuplicates(cells) {
        const seen = checkForDuplicates(cells);
        seen.forEach((cellList, value) => {
            if (cellList.length > 1) {
                cellList.forEach(cell => cell.style.backgroundColor = 'red');
            }
        });
    }

    cells.forEach((cell, index) => {
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;

        // Check row
        const rowCells = cells.slice(row * gridSize, (row + 1) * gridSize);
        highlightDuplicates(rowCells);

        // Check column
        const colCells = cells.filter((_, i) => i % gridSize === col);
        highlightDuplicates(colCells);

        // Check block
        const blockCells = getBlockCells(row, col);
        highlightDuplicates(blockCells);
    });

    let flag = false;
    for(let i = 0; i< cells.length && flag===false; i++) {
        if (cells[i].textContent === "" || cells[i].style.backgroundColor === 'red') {
            flag = true;
        }
    }

    setTimeout(() => {if (flag === false) {
    let form = document.createElement('form');
    let url = "leaderboard/";
    let baseurl = window.location.origin;
    let ur = new URL(url, baseurl);
    form.method="post";
    form.action=ur;
    form.enctype="multipart/form-data";
    document.body.appendChild(form);
    form.data = {'csrfmiddlewaretoken': document.getElementsByName("csrfmiddlewaretoken")[0].value};
    let input1 = document.createElement("input");
    input1.type = "text";
    input1.name = "time1";
    input1.value = document.getElementById('stopwatch').textContent;
    form.appendChild(input1);
    let input2 = document.createElement("input");
    input2.type="text";
    input2.name="puzzle_id";
    input2.value = document.body.getAttribute("puzzle_id");//puzzle_id
    form.appendChild(input2);
    let input3 = document.createElement("input");
    input3.type="text";
    input3.name="puzzletype";
    input3.value = document.body.getAttribute("puzzletype");//puzzletype_id
    form.appendChild(input3);
    let input4 = document.createElement("input");
    input4.type="hidden";
    input4.name="csrfmiddlewaretoken";
    input4.value = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    form.appendChild(input4);
    let input5 = document.createElement("input");
    input5.type="text";
    input5.name="level";
    input5.value = document.body.getAttribute("difficultylevel");
    form.appendChild(input5);
    form.submit();
    document.body.removeChild(form);
    return false;
    }}, 100);
}

function _fillGame(data) {
    const cells = Array.from(document.querySelectorAll('#sudoku-grid td'));
    for (let i = 0; i < data.length; i++) {
        const cell = cells[i];
        const char = data[i];
        if (char === "0") {
            cell.textContent = "";
            cell.style.backgroundColor = 'white';
            cell.style.fontWeight = 'normal';
            cell.setAttribute('contenteditable', true);
            cell.removeAttribute('data-initial-value');
        } else {
            cell.textContent = char;
            cell.style.backgroundColor = 'white';
            cell.style.fontWeight = 'bold';
            cell.setAttribute('contenteditable', false);
            cell.setAttribute('data-initial-value', char); // Mark preset values
        }
    }
}


function submitform(event) {
    // console.log(event.target.id);
    let i = event.target.id;
    let pt = "";
    let dl = "";
    if (i[0]==="4") {
        pt = "4x4";
    }
    else if (i[0] == "6") {
        pt = "6x6";
    }
    else {
        pt = "9x9";
    }
    if (i[1] == "e") {
        dl = "easy";
    }
    else if (i[1] == "m") {
        dl = "medium";
    }
    else {
        dl = "hard";
    }
    // console.log(pt);
    // console.log(dl);
    if (i === "new-game"){
        pt = document.body.getAttribute('puzzletype');
        dl = document.body.getAttribute('difficultylevel');
    }
    let form = document.createElement('form');
     let url = "puzzlemain/";
    let baseurl = window.location.origin;
    let ur = new URL(url, baseurl);
    //console.log(ur);
    //form.puzzletype=pt;
    //form.dl=dl;
    form.method="post";
    form.action=ur;
    form.enctype="multipart/form-data";
    document.body.appendChild(form);
    // console.log(form);
    // console.log(document.getElementsByName("csrfmiddlewaretoken")[0].value);
    form.data = {'csrfmiddlewaretoken': document.getElementsByName("csrfmiddlewaretoken")[0].value};
    let input1 = document.createElement("input");
    input1.type = "text";
    input1.name = "puzzletype";
    input1.value = pt;
    form.appendChild(input1);
    let input2 = document.createElement("input");
    input2.type = "text";
    input2.name = "dl";
    input2.value = dl;
    form.appendChild(input2);
    let input3 = document.createElement("input");
    input3.type="hidden";
    input3.name="csrfmiddlewaretoken";
    input3.value = document.getElementsByName("csrfmiddlewaretoken")[0].value;
    form.appendChild(input3);
    // console.log(form);
    form.submit();
    document.body.removeChild(form);
    return false;
}
