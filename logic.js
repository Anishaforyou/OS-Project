const canvas = document.getElementById('memoryCanvas');
const ctx = canvas.getContext('2d');
let memoryBlocks = [];
let processes = [];

const processSizeInput = document.getElementById('processSize');
const addProcessBtn = document.getElementById('addProcessBtn');
const addMemoryBlockBtn = document.getElementById('addMemoryBlockBtn');
const calculateBtn = document.getElementById('calculateBtn');
const deallocateBtn = document.getElementById('deallocateBtn');
const clearBtn = document.getElementById('clearBtn');
const strategySelect = document.getElementById('strategySelect');
const memoryBlockSizeInput = document.getElementById('memoryBlockSize');
const memoryError = document.getElementById('memoryError');
const processError = document.getElementById('processError');
const memoryBlockList = document.getElementById('memoryBlockList');
const processList = document.getElementById('processList');
const currentStrategy = document.getElementById('currentStrategy');

// Add memory block based on user input
addMemoryBlockBtn.addEventListener('click', () => {
    const size = parseInt(memoryBlockSizeInput.value);
    if (size > 0) {
        memoryBlocks.push({ size: size, free: true, processSize: null });
        memoryBlockSizeInput.value = '';
        memoryError.style.display = 'none';
        drawMemory();
        updateMemoryBlockList();
    } else {
        memoryError.style.display = 'block';
    }
});

// Add process to the list
addProcessBtn.addEventListener('click', () => {
    const size = parseInt(processSizeInput.value);
    if (size > 0) {
        processes.push(size);
        processSizeInput.value = '';
        processError.style.display = 'none';
        updateProcessList();
    } else {
        processError.style.display = 'block';
    }
});

// Clear memory blocks and process sizes
clearBtn.addEventListener('click', () => {
    memoryBlocks = [];
    processes = [];
    drawMemory();
    updateMemoryBlockList();
    updateProcessList();
    currentStrategy.textContent = '';
});

// Allocate memory based on the selected strategy
calculateBtn.addEventListener('click', () => {
    const strategy = strategySelect.value;
    currentStrategy.textContent = `Running: ${strategy} strategy`;
    processes.forEach(process => {
        if (strategy === 'firstFit') {
            firstFit(process);
        } else if (strategy === 'bestFit') {
            bestFit(process);
        } else if (strategy === 'worstFit') {
            worstFit(process);
        }
    });
    drawMemory();
});

// Deallocate all memory blocks
deallocateBtn.addEventListener('click', () => {
    memoryBlocks.forEach(block => {
        block.free = true;
        block.processSize = null;
    });
    drawMemory();
    currentStrategy.textContent = 'All memory blocks have been deallocated';
});

// Function to update memory block list display
function updateMemoryBlockList() {
    memoryBlockList.innerHTML = `Memory Blocks: ${memoryBlocks.map(block => `${block.size} KB`).join(', ')}`;
}

// Function to update process list display
function updateProcessList() {
    processList.innerHTML = `Processes: ${processes.join(', ')} KB`;
}

function firstFit(processSize) {
    for (let block of memoryBlocks) {
        if (block.free && block.size >= processSize) {
            block.free = false;
            block.processSize = processSize;
            return;
        }
    }
    alert(`No suitable block found for process size ${processSize} KB`);
}

function bestFit(processSize) {
    let bestBlock = null;
    for (let block of memoryBlocks) {
        if (block.free && block.size >= processSize) {
            if (!bestBlock || block.size < bestBlock.size) {
                bestBlock = block;
            }
        }
    }
    if (bestBlock) {
        bestBlock.free = false;
        bestBlock.processSize = processSize;
    } else {
        alert(`No suitable block found for process size ${processSize} KB`);
    }
}

function worstFit(processSize) {
    let worstBlock = null;
    for (let block of memoryBlocks) {
        if (block.free && block.size >= processSize) {
            if (!worstBlock || block.size > worstBlock.size) {
                worstBlock = block;
            }
        }
    }
    if (worstBlock) {
        worstBlock.free = false;
        worstBlock.processSize = processSize;
    } else {
        alert(`No suitable block found for process size ${processSize} KB`);
    }
}

// Draw memory blocks on canvas
function drawMemory() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let x = 10, y = 10, width = 80, height = 50;

    memoryBlocks.forEach((block, index) => {
        ctx.fillStyle = block.free ? 'lightgreen' : 'lightcoral';
        ctx.fillRect(x, y + index * (height + 10), width, height);
        ctx.strokeRect(x, y + index * (height + 10), width, height);
        ctx.fillStyle = 'black';
        ctx.fillText(`${block.size} KB (${block.free ? 'Free' : `Used by ${block.processSize} KB`})`, x + 10, y + index * (height + 10) + 25);
    });
}
