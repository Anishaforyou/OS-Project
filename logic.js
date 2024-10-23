const canvas = document.getElementById('memoryCanvas');
const ctx = canvas.getContext('2d');
let memoryBlocks = [];
let processes = [];

const processSizeInput = document.getElementById('processSize');
const addProcessBtn = document.getElementById('addProcessBtn');
const addMemoryBlockBtn = document.getElementById('addMemoryBlockBtn');
const calculateBtn = document.getElementById('calculateBtn');
const deallocateBtn = document.getElementById('deallocateBtn');
const strategySelect = document.getElementById('strategySelect');
const memoryBlockSizeInput = document.getElementById('memoryBlockSize');
const memoryError = document.getElementById('memoryError');
const processError = document.getElementById('processError');

// Add memory block based on user input
addMemoryBlockBtn.addEventListener('click', () => {
    const size = parseInt(memoryBlockSizeInput.value);
    if (size > 0) {
        memoryBlocks.push({ size: size, free: true, processSize: null });
        memoryBlockSizeInput.value = '';
        memoryError.style.display = 'none';
        drawMemory();
        alert(`Memory block of ${size} KB added`);
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
        alert(`Process of ${size} KB added`);
    } else {
        processError.style.display = 'block';
    }
});

// Allocate memory based on the selected strategy
calculateBtn.addEventListener('click', () => {
    const strategy = strategySelect.value;
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
    alert('All memory blocks have been deallocated');
});

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

    memoryBlocks.forEach(block => {
        ctx.strokeStyle = '#000';
        ctx.strokeRect(x, y, width, height);
        if (block.free) {
            ctx.fillStyle = '#90EE90'; // Free block (green)
            ctx.fillRect(x, y, width, height);
        } else {
            ctx.fillStyle = '#FF6347'; // Allocated block (red)
            ctx.fillRect(x, y, width, height);
            ctx.fillStyle = '#000';
            ctx.fillText(`${block.processSize} KB`, x + 10, y + 25);
        }
        y += height + 10;
    });
}

drawMemory();
