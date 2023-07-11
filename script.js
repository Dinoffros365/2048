const block = document.querySelector('.block');
const scoreBlock = document.querySelector('.controls-block__score');
let data = new Date();
let dirBlock = null;
let matrix = [];
let matrixClone = [];
let firstClick = {};
let secondClick = {};

for (let i = 0; i < 4; i++) {
    matrix.push([]);
    for (let j = 0; j < 4; j++) {
        let nameClass = 'cellX-' + i + '_cellY-' + j;
        const cell = document.createElement('div');
        cell.classList.add(nameClass);
        matrix[i].push(0);
        block.append(cell);
    }
}

let isTaken = false;
let posX = getRandomInt(0, 3);
let posY = getRandomInt(0, 3);
let miniBlock = document.querySelector('.cellX-' + posX + '_cellY-' + posY);
matrix[posX][posY] = 2;
miniBlock.textContent = '2';
miniBlock.classList.add('active-2');

block.addEventListener('mousedown', (event) => {
    firstClick = { x: event.screenX, y: event.screenY };
})

block.addEventListener('mouseup', (event) => {
    secondClick = { x: event.screenX, y: event.screenY };
})

block.addEventListener('click', () => {

    if (Math.abs(firstClick.x - secondClick.x) > Math.abs(firstClick.y - secondClick.y)) {
        if (firstClick.x - secondClick.x < 0) dirBlock = 'Right';
        if (firstClick.x - secondClick.x > 0) dirBlock = 'Left';
    } else if (Math.abs(firstClick.x - secondClick.x) < Math.abs(firstClick.y - secondClick.y)) {
        if (firstClick.y - secondClick.y < 0) dirBlock = 'Down';
        if (firstClick.y - secondClick.y > 0) dirBlock = 'Up';
    }

    if ((+new Date() - data) < 252) return;

    playGame(dirBlock);

    dirBlock = null;

    data = new Date();
})

window.addEventListener("keydown", (e) => {
    if ((+new Date() - data) < 252) return;
    
    if (e.key === 'ArrowUp') dirBlock = 'Up';
    else if (e.key === 'ArrowDown') dirBlock = 'Down';
    else if (e.key === 'ArrowLeft') dirBlock = 'Left';
    else if (e.key === 'ArrowRight') dirBlock = 'Right';

    playGame(dirBlock);

    dirBlock = null;

    data = new Date();
});

function playGame(dirBlock) {
    matrixClone = JSON.parse(JSON.stringify(matrix));
    
    if (dirBlock === 'Up') swipeUp();
    else if (dirBlock === 'Right') swipeRight();
    else if (dirBlock === 'Down') swipeDown();
    else if (dirBlock === 'Left') swipeLeft();
    

    setTimeout(() => {
        let posObject = findWithoutActive();

        if (posObject.countActiveBlock === 16) {
            checkOnFail();
        }

        if (!equal(matrix, matrixClone)) {
            matrix[posObject.posX][posObject.posY] = 2;
            miniBlock = document.querySelector('.cellX-' + posObject.posX + '_cellY-' + posObject.posY);
            miniBlock.textContent = '2';
            miniBlock.classList.add('active-2');
        }
    }, 250);
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getBlock(i, j) {
    setTimeout(() => {
        miniBlock = document.querySelector('.cellX-' + i + '_cellY-' + j);
        if (matrix[i][j] > 0) {
            miniBlock.textContent = matrix[i][j];
            miniBlock.className = 'cellX-' + i + '_cellY-' + j + ' active-' + matrix[i][j];
        }
    }, 200)
}

function removeBlock(i, j, animeBlock) {
    miniBlock = document.querySelector('.cellX-' + i + '_cellY-' + j);

    if (animeBlock) {
        animeBlock.classList.add('animated-block');
        block.prepend(animeBlock);
        animeBlock.style.width = document.querySelector('.cellX-0_cellY-0').offsetWidth + 'px';
        animeBlock.style.height = document.querySelector('.cellX-0_cellY-0').offsetHeight + 'px';

        animeBlock.classList.add(miniBlock.className.split(' ')[1]);
        animeBlock.textContent = miniBlock.textContent;
        animeBlock.style.top = 100 * i + 'px';
        animeBlock.style.left = 100 * j + 'px';
    }

    miniBlock.className = 'cellX-' + i + '_cellY-' + j;
    miniBlock.textContent = '';
    matrix[i][j] = 0;

}

function equal(arr, arrClone) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            if (arr[i][j] !== arrClone[i][j]) {
                return false;
            }
        }
    }

    return true;
}

function swipeUp() {
    for (let j = 0; j < 4; j++) {
        for (let i = 1; i < 4; i++) {

            let leftIndex = '';

            if (((matrix[0][j] === matrix[i][j] && matrix[i][j] > 0) || (matrix[0][j] === 0 && matrix[i][j] > 0)) && (i === 1 || (i === 2 && matrix[1][j] === 0) || (i === 3 && (matrix[1][j] + matrix[2][j] === 0)))) {
                if(matrix[0][j] !== 0) addScore(i, j);
                
                matrix[0][j] += matrix[i][j];
                leftIndex = 0;
                isTaken = true;
            }
            else if (((matrix[1][j] === matrix[i][j] && matrix[i][j] > 0 && i > 1) || (matrix[1][j] === 0 && matrix[i][j] > 0 && i > 1)) && ((i === 2) || (i === 3 && matrix[2][j] === 0))) {
                if(matrix[1][j] !== 0) addScore(i, j);
                
                matrix[1][j] += matrix[i][j];
                leftIndex = 1;
                isTaken = true;
            }
            else if ((matrix[2][j] === matrix[i][j] && matrix[i][j] > 0 && i > 2) || (matrix[2][j] === 0 && matrix[i][j] > 0 && i > 2)) {
                if(matrix[2][j] !== 0) addScore(i, j);
               
                matrix[2][j] += matrix[i][j];
                leftIndex = 2;
                isTaken = true;
            }

            if (isTaken === true) {
                let animationBlock = document.createElement('div'); 

                removeBlock(i, j, animationBlock);

                animateBlock(animationBlock, 'top', i, leftIndex);

                getBlock(leftIndex, j);
            }

            isTaken = false;
        }
    }
}

function swipeRight() {
    for (let i = 0; i < 4; i++) {
        for (let j = 2; j > -1; j--) {

            leftIndex = '';

            if (((matrix[i][3] === matrix[i][j] && matrix[i][j] > 0) || (matrix[i][3] === 0 && matrix[i][j] > 0)) && (j === 2 || (j === 1 && matrix[i][2] === 0) || (j === 0 && (matrix[i][2] + matrix[i][1] === 0)))) {
                if(matrix[i][3] !== 0) addScore(i, j);

                matrix[i][3] += matrix[i][j];
                leftIndex = 3;
                isTaken = true;
            }
            else if (((matrix[i][2] === matrix[i][j] && matrix[i][j] > 0 && j < 2) || (matrix[i][2] === 0 && matrix[i][j] > 0 && j < 2)) && (j === 1 || (j === 0 && matrix[i][1] === 0))) {
                if(matrix[i][2] !== 0) addScore(i, j);
               
                matrix[i][2] += matrix[i][j];
                leftIndex = 2;
                isTaken = true;
            }
            else if ((matrix[i][1] === matrix[i][j] && matrix[i][j] > 0 && j < 1) || (matrix[i][1] === 0 && matrix[i][j] > 0 && j < 1)) {
                if(matrix[i][1] !== 0) addScore(i, j);
               
                matrix[i][1] += matrix[i][j];
                leftIndex = 1;
                isTaken = true;
            }

            if (isTaken === true) {
                let animationBlock = document.createElement('div');

                removeBlock(i, j, animationBlock);

                animateBlock(animationBlock, 'left', j, leftIndex);

                getBlock(i, leftIndex);
            }

            isTaken = false;
        }
    }
}

function swipeDown() {
    for (let j = 0; j < 4; j++) {
        for (let i = 2; i > -1; i--) {

            let leftIndex = '';

            if (((matrix[3][j] === matrix[i][j] && matrix[i][j] > 0) || (matrix[3][j] === 0 && matrix[i][j] > 0)) && (i === 2 || (i === 1 && matrix[2][j] === 0) || (i === 0 && (matrix[1][j] + matrix[2][j] === 0)))) {
                if(matrix[3][j] !== 0) addScore(i, j);
                
                matrix[3][j] += matrix[i][j];
                leftIndex = 3;
                isTaken = true;
            }
            else if (((matrix[2][j] === matrix[i][j] && matrix[i][j] > 0 && i < 2) || (matrix[2][j] === 0 && matrix[i][j] > 0 && i < 2)) && ((i === 1) || (i === 0 && matrix[1][j] === 0))) {
                if(matrix[2][j] !== 0) addScore(i, j);
                
                matrix[2][j] += matrix[i][j];
                leftIndex = 2;
                isTaken = true;
            }
            else if ((matrix[1][j] === matrix[i][j] && matrix[i][j] > 0 && i < 1) || (matrix[1][j] === 0 && matrix[i][j] > 0 && i < 1)) {
                if(matrix[1][j] !== 0) addScore(i, j);
               
                matrix[1][j] += matrix[i][j];
                leftIndex = 1;
                isTaken = true;
            }

            if (isTaken === true) {
                let animationBlock = document.createElement('div');

                removeBlock(i, j, animationBlock);

                animateBlock(animationBlock, 'bottom', i, leftIndex);

                getBlock(leftIndex, j);
            }


            isTaken = false;
        }
    }
}

function swipeLeft() {
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {

            let leftIndex = '';

            if (((matrix[i][0] === matrix[i][j] && matrix[i][j] > 0) || (matrix[i][0] === 0 && matrix[i][j] > 0)) && (j === 1 || (j === 2 && matrix[i][1] === 0) || (j === 3 && (matrix[i][1] + matrix[i][2] === 0)))) {
                if(matrix[i][0] !== 0) addScore(i, j);
                
                matrix[i][0] += matrix[i][j];
                leftIndex = 0;
                isTaken = true;
            }
            else if (((matrix[i][1] === matrix[i][j] && matrix[i][j] > 0 && j > 1) || (matrix[i][1] === 0 && matrix[i][j] > 0 && j > 1)) && (j === 2 || (j === 3 && matrix[i][2] === 0))) {
                if(matrix[i][1] !== 0) addScore(i, j);
              
                matrix[i][1] += matrix[i][j];
                leftIndex = 1;
                isTaken = true;
            }
            else if ((matrix[i][2] === matrix[i][j] && matrix[i][j] > 0 && j > 2) || (matrix[i][2] === 0 && matrix[i][j] > 0 && j > 2)) {
                if(matrix[i][2] !== 0) addScore(i, j);
               
                matrix[i][2] += matrix[i][j];
                leftIndex = 2;
                isTaken = true;
            }

            if (isTaken === true) {
                let animationBlock = document.createElement('div');

                removeBlock(i, j, animationBlock);

                animateBlock(animationBlock, 'right', j, leftIndex);

                getBlock(i, leftIndex);
            }

            isTaken = false;
        }
    }
}

function animate({ timing, draw, duration, block }) {

    let start = performance.now();

    requestAnimationFrame(function animate(time) {
        // timeFraction изменяется от 0 до 1
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) timeFraction = 1;

        // вычисление текущего состояния анимации
        let progress = timing(timeFraction);

        draw(progress); // отрисовать её

        if (timeFraction < 1) {
            requestAnimationFrame(animate);
        } else {
            block.className = '';
            block.remove();
        }

    });
}

function animateBlock(block, side, start, finish) {
    animate({
        duration: 200,
        timing: quad,
        draw: function (progress) {
            if (side === 'left' || side === 'right') block.style.left = (finish - start) * 100 * progress + start * 100 + 'px';
            else if (side === 'top' || side === 'bottom') block.style.top = (finish - start) * 100 * progress + start * 100 + 'px';
        },
        block: block,
    })
}

function quad(timeFraction) {
    return Math.pow(timeFraction, 2);
}

function findWithoutActive() {

    posX = getRandomInt(0, 3);
    posY = getRandomInt(0, 3);
    miniBlock = document.querySelector('.cellX-' + posX + '_cellY-' + posY);

    let countActiveBlock = 0;

    while (miniBlock.classList.contains('active-' + matrix[posX][posY])) {
        posX = getRandomInt(0, 3);
        posY = getRandomInt(0, 3);
        miniBlock = document.querySelector('.cellX-' + posX + '_cellY-' + posY);

        if (countActiveBlock === 8) {
            let indexOfRow = '';
            let indexOfColumn = matrix.find((item, index) => {
                if (item.includes(0)) {
                    indexOfRow = index;
                    return true;
                }
            });
            if (indexOfColumn) {
                indexOfColumn = indexOfColumn.indexOf(0);
                miniBlock = document.querySelector('.cellX-' + indexOfRow + '_cellY-' + indexOfColumn);
                posX = indexOfRow;
                posY = indexOfColumn;
            }
        }

        countActiveBlock++;

        if (countActiveBlock === 16) break;
    }
    return { 'posX': posX, 'posY': posY, 'countActiveBlock': countActiveBlock };
}

function checkOnFail() {
    let isCheck = false; 

    outer: for (let j = 0; j < 4; j++) {
        for (let i = 1; i < 4; i++) {
            if (((matrix[0][j] === matrix[i][j] && matrix[i][j] > 0) || (matrix[0][j] === 0 && matrix[i][j] > 0)) && (i === 1 || (i === 2 && matrix[1][j] === 0) || (i === 3 && (matrix[1][j] + matrix[2][j] === 0)))) {
                isCheck = true;
                break outer;
            }
            else if (((matrix[1][j] === matrix[i][j] && matrix[i][j] > 0 && i > 1) || (matrix[1][j] === 0 && matrix[i][j] > 0 && i > 1)) && ((i === 2) || (i === 3 && matrix[2][j] === 0))) {
                isCheck = true;
                break outer;
            }
            else if ((matrix[2][j] === matrix[i][j] && matrix[i][j] > 0 && i > 2) || (matrix[2][j] === 0 && matrix[i][j] > 0 && i > 2)) {
                isCheck = true;
                break outer;
            }
        }
    }

    outer: for (let i = 0; i < 4; i++) {
        for (let j = 2; j > -1; j--) {
            if (((matrix[i][3] === matrix[i][j] && matrix[i][j] > 0) || (matrix[i][3] === 0 && matrix[i][j] > 0)) && (j === 2 || (j === 1 && matrix[i][2] === 0) || (j === 0 && (matrix[i][2] + matrix[i][1] === 0)))) {
                isCheck = true;
                break outer;
            }
            else if (((matrix[i][2] === matrix[i][j] && matrix[i][j] > 0 && j < 2) || (matrix[i][2] === 0 && matrix[i][j] > 0 && j < 2)) && (j === 1 || (j === 0 && matrix[i][1] === 0))) {
                isCheck = true;
                break outer;
            }
            else if ((matrix[i][1] === matrix[i][j] && matrix[i][j] > 0 && j < 1) || (matrix[i][1] === 0 && matrix[i][j] > 0 && j < 1)) {
                isCheck = true;
                break outer;
            }
        }
    }

    outer: for (let j = 0; j < 4; j++) {
        for (let i = 2; i > -1; i--) {
            if (((matrix[3][j] === matrix[i][j] && matrix[i][j] > 0) || (matrix[3][j] === 0 && matrix[i][j] > 0)) && (i === 2 || (i === 1 && matrix[2][j] === 0) || (i === 0 && (matrix[1][j] + matrix[2][j] === 0)))) {
                isCheck = true;
                break outer;
            }
            else if (((matrix[2][j] === matrix[i][j] && matrix[i][j] > 0 && i < 2) || (matrix[2][j] === 0 && matrix[i][j] > 0 && i < 2)) && ((i === 1) || (i === 0 && matrix[1][j] === 0))) {
                isCheck = true;
                break outer;
            }
            else if ((matrix[1][j] === matrix[i][j] && matrix[i][j] > 0 && i < 1) || (matrix[1][j] === 0 && matrix[i][j] > 0 && i < 1)) {
                isCheck = true;
                break outer;
            }
        }
    }
    
    outer: for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            if (((matrix[i][0] === matrix[i][j] && matrix[i][j] > 0) || (matrix[i][0] === 0 && matrix[i][j] > 0)) && (j === 1 || (j === 2 && matrix[i][1] === 0) || (j === 3 && (matrix[i][1] + matrix[i][2] === 0)))) {
                isCheck = true;
                break outer;
            }
            else if (((matrix[i][1] === matrix[i][j] && matrix[i][j] > 0 && j > 1) || (matrix[i][1] === 0 && matrix[i][j] > 0 && j > 1)) && (j === 2 || (j === 3 && matrix[i][2] === 0))) {
                isCheck = true;
                break outer;
            }
            else if ((matrix[i][2] === matrix[i][j] && matrix[i][j] > 0 && j > 2) || (matrix[i][2] === 0 && matrix[i][j] > 0 && j > 2)) {
                isCheck = true;
                break outer;
            }
        }
    }

    if (isCheck === false) {
        alert('Wasted');
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                removeBlock(i, j);
            }
        }

        scoreBlock.textContent = '0';
    }
}

function newGame() {
    posX = getRandomInt(0, 3);
    posY = getRandomInt(0, 3);
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            removeBlock(i, j);
        }
    }
    matrix[posX][posY] = 2;
    getBlock(posX, posY);

    scoreBlock.textContent = '0';
}

function addScore(i, j) {
    scoreBlock.textContent = +scoreBlock.textContent + matrix[i][j];
}