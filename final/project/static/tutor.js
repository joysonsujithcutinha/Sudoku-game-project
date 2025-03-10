document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('sudoku-grid');
    const solveButton = document.getElementById('solve');
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
solveButton.addEventListener('click',solve);
let solveerror = true;

function solve(){
    const cells = grid.querySelectorAll('td');
    document.getElementById('solve').removeEventListener('click',solve);
    document.getElementById('solve').textContent = "Next";
    let solveerror = false;
    cells.forEach(cell => {
        if (cell.style.backgroundColor === 'red'){
            solveerror = true;
        }
    });
    if (solveerror) {
        alert('Invalid puzzle (duplicates)');
        return;
    }
    cells.forEach(cell => {
        if (cell.textContent === '') {
            cell.style.backgroundColor = '';
            cell.style.fontWeight = '';
        } else {
        cell.style.backgroundColor = 'gray';
        cell.style.fontWeight = 'bold';
        }
    });
    let inpuzzle = [];
    cells.forEach(cell => {
        if (cell.textContent === '') {
            inpuzzle.push(0);
        }
        else {
            inpuzzle.push(Number(cell.textContent));
        }
    });
    function convert1DTo2D(inpuzzle, cols) {
        const grid = [];
        for (let i = 0; i < inpuzzle.length; i += cols) {
            grid.push(inpuzzle.slice(i, i + cols));
        }
        return grid;
    }
    
    function convert2DTo1D(grid) {
        return grid.flat(); // Flatten the 2D array to 1D
    }
    
    // Assuming the grid size is known (e.g., 4x4, 6x6, 9x9)
    const cols = Math.sqrt(inpuzzle.length); // Adjust this based on your grid size
    const grid2D = convert1DTo2D(inpuzzle, cols);
    
    // Solve the Sudoku
    if (solveSudoku(grid2D,cells)) {
        let outgrid = convert2DTo1D(grid2D);
    } else {
        alert("No solution exists.");
    }
    //for each cell (line 18 loop), cell value equal to output 1d (and incr)
    async function solveSudoku(grid,cells) {
        const find = findEmptyLocation(grid);
        if (!find) {
            return true; // Puzzle solved
        }
        const { row, col, min } = find;
    
        const size = grid.length; // grid is 2D
        function convert2DTo1DIndex(rowno, colno, gridSizeno) {
            return (rowno * gridSizeno) + colno; // Return the 1D index
        }
        function sleep(time) {
            return new Promise((resolve) => setTimeout(resolve, time));
        }
        
        for (let num = 1; num <= size; num++) {
            if (isSafe(grid, row, col, num)) {
                grid[row][col] = num; // Place the number
                let i=convert2DTo1DIndex(row,col,size);
                if (min === 1) {
                    let sen = [];
                    sen[0] = "Finding place where only one number is possible. Found one at Row " + String (row) + " and Col " + String (col) + ". Here only number possible is " + String (num) + ".";
                    sen[1] = "Hey buddy! At Row" + String (row) + " and Col" + String (col) + ", only one number is possible, and it is " + String (num) + "! Let's go for it!"
                    sen[2] = "Discovered a spot where a single value is allowed. Found it at Row " + String (row) + " and Col " + String (col) + ". The only possible number in this case is " + String (num) + ".";
                    sen[3] = "Detected a position where just one numeral is valid. Marked at Row " + String (row) + " and Col " + String (col) + ". The sole number that can occupy this space is " + String (num) + ".";
                    sen[4] =  "Located an area where exclusively one integer is suitable. Found at Row " + String (row) + " and Col " + String (col) + ". The unique number that fits here is " + String (num) + ".";
                    let pos = Math.floor(Math.random()*100) % sen.length;
                    document.getElementById('sentence').textContent = sen[pos];
                    cells[i].style.backgroundColor='blue';
                } else {
                    let men=[];
                    men[0] = "If you look carefully, there is no place having only one possible entry as of now. Row " + String (row) + " and Col " + String (col) + " has " + String (min) + " options possible. Let's choose " + String (num) + " for now.";
                    men[1] = "Upon closer inspection, there isn't a single location with only one possible entry at this moment. Row " + String (row) + " and Col " + String (col) + " has " + String (min) + " options available. For now, let’s select " + String (num) + ".";
                    men[2] = "If you pay attention, there is no cell with only one possible entry available at this time. Row " + String (row) + " and Col " + String (col) + " has " + String (min) + " alternatives. For now, let’s choose " + String (num) + ".";
                    men[3] = "Looking closely, you can see there’s no position with just one potential entry at this point. Row " + String (row) + " and Col " + String (col) + " provides " + String (min) + " options. Let's opt for " + String (num) + " for now.";
                    men[4] = "With careful observation, it’s clear that no area currently has only one possible entry. Row " + String (row) + " and Col " + String (col) + " presents " + String (min) + " choices. For now, we'll pick " + String (num) + ".";
                    let pos1 = Math.floor(Math.random()*100) % men.length;
                    document.getElementById('sentence').textContent = men[pos1];
                    cells[i].style.backgroundColor='blue';
                }
                async function pauseUntilEvent (clickListenerPromise) {
                    await clickListenerPromise;
                  }
                  
                  function createClickListenerPromise (target) {
                    return new Promise((resolve) => target.addEventListener('click', resolve));
                  }
                  
                await  pauseUntilEvent(createClickListenerPromise(document.getElementById('solve')));
                cells[i].textContent = String(num);
                cells[i].style.backgroundColor='aquamarine';
                await  pauseUntilEvent(createClickListenerPromise(document.getElementById('solve')));
    
                if (await solveSudoku(grid,cells)) {
                    return true; // Successfully solved
                }
                grid[row][col] = 0; // Backtrack
                cells[i].textContent = "";
                cells[i].style.backgroundColor='aquamarine';
            }
        }
        
        return false; // No solution
    }
    function isSafe(grid, row, col, num) {
        const size = grid.length;
        let subGridSizec, subGridSizer;
    
        if (Math.pow(Math.floor(Math.sqrt(size)), 2) === size) {
            subGridSizec = subGridSizer = Math.sqrt(size);
        } else {
            if (grid.length === 6) {
                subGridSizer = 2;
                subGridSizec = 3;
            }
        }
    
        // Check row and column
        for (let i = 0; i < size; i++) {
            if (grid[row][i] === num || grid[i][col] === num) {
                return false;
            }
        }
    
        // Check sub-grid
        const boxStartRow = row - (row % subGridSizer);
        const boxStartCol = col - (col % subGridSizec);
        for (let i = 0; i < subGridSizer; i++) {
            for (let j = 0; j < subGridSizec; j++) {
                if (grid[i + boxStartRow][j + boxStartCol] === num) {
                    return false;
                }
            }
        }
        return true; // Safe to place the number
    }
    function findEmptyLocation(grid) {
        let rowmin = 100;
        let colmin = 100;
        let min = 100;
        let emptyfound = false;
        let curr = 0;
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                if (grid[row][col] === 0) {
                    emptyfound = true;
                    curr = 0;
                    for (let num = 1; num <= grid.length; num++) {
                        if (isSafe(grid,row,col,num)) {
                            curr++;
                        }   
                    }
                    if (curr < min) {
                        rowmin = row;
                        colmin = col;
                        min = curr;
                    }
                }
            }
        }
        if (emptyfound) {
            let row = rowmin;
            let col = colmin;
            return {row, col, min};
        }
        document.getElementById('sentence').textContent = "Game is completely solved, Congrats you successfully learned how to solve this puzzle";
        document.getElementById('solve').style.visibility = 'hidden';
        return null; // No empty location
    } 
    function printGrid(grid) {
        console.log('[');
        grid.forEach((row, index) => {
            console.log(`  [${row.join(', ')}]${index < grid.length - 1 ? ',' : ''}`);
        });
        console.log(']');
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
            cell.setAttribute('contenteditable', false);
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
});
