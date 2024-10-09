const board = document.querySelector('.game-board');
const score = document.querySelector('.score');
const totalCells = 120;
const occupiedCells = new Set();
const cells = [];
let counter = 0

// יצירת התאים
for (let i = 0; i < totalCells; i++) {
    // if(i!=24||i!=)
    const cell = document.createElement('div');
    cell.classList.add('cell');
    board.appendChild(cell);
    cells.push(cell); // שמירה במערך לצורך גישה נוחה לכל התאים
}

// מיקום התחלתי של השחקן במרכז הלוח 
let playerPosition = 65;
cells[playerPosition].innerHTML = '<span class="player">😀</span>';

// פונקציה שבודקת אם התא הוא תא חיצוני
function isOuterCell(index) {
    return index < 12 || index >= 108 || index % 12 === 0 || index % 12 === 11;
}

let ballCount = 0; 
let ballInterval; 
// הוספת כדורים כל שניה
function addBall() {
    if (ballCount >= 80) {
        clearInterval(ballInterval); // מפסיק את הטיימר אם יש 80 כדורים
        return; 
    }
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * totalCells);
    } while (occupiedCells.has(randomIndex) || isOuterCell(randomIndex) || randomIndex === playerPosition); // הימנע מתאים תפוסים או חיצוניים

    occupiedCells.add(randomIndex);
    cells[randomIndex].innerHTML = '<span class="ball">⚽</span>';
    ballCount++; 
}

ballInterval = setInterval(addBall, 500);

// פונקציה להזזת השחקן
function movePlayer(newPosition) {

    if (cells[newPosition].innerHTML.includes('⚽')) {
        counter++;
        score.textContent = counter;
    }
    cells[playerPosition].innerHTML = '';
    playerPosition = newPosition;
    cells[playerPosition].innerHTML = '<span class="player">😀</span>';
    if (counter === 80) {
        cells[playerPosition].innerHTML = '<span class="player">🥳</span>'; 
    
        setTimeout(() => {
            if (confirm("Congratulations! You've caught all the balls! Would you like to restart the game?")) {
                restartGame();
            }
        }, 0); 
    }
    
}


// מאזינים לאירועים של לחיצה על מקשים
document.addEventListener('keydown', function (event) {
    let newPosition = playerPosition;
    const columns = 12;

    switch (event.key) {
        case 'ArrowUp':
            if (newPosition - columns >= 0 && !isOuterCell(newPosition - columns)) {
                // מוודא שהשחקן לא עובר את הגבול העליון ולא זז לתא חיצוני
                newPosition -= columns;
            }
            break;
        case 'ArrowDown':
            if (newPosition + columns < totalCells && !isOuterCell(newPosition + columns)) {
                // מוודא שהשחקן לא עובר את הגבול התחתון ולא זז לתא חיצוני
                newPosition += columns;
            }
            break;
        case 'ArrowLeft':
            if (newPosition % columns !== 0 && !isOuterCell(newPosition - 1)) {
                // מוודא שהשחקן לא עובר את הגבול השמאלי ולא זז לתא חיצוני
                newPosition -= 1;
            }
            break;
        case 'ArrowRight':
            if (newPosition % columns !== columns - 1 && !isOuterCell(newPosition + 1)) {
                // מוודא שהשחקן לא עובר את הגבול הימני ולא זז לתא חיצוני
                newPosition += 1;
            }
            break;
    }

    movePlayer(newPosition); // מעדכן את מיקום השחקן
});

function restartGame() {
    // איפוס המונה
    counter = 0;
    score.textContent = counter;
    
    // איפוס הכדורים   
    occupiedCells.clear();
    cells.forEach(cell => {
        cell.innerHTML = '';
    });

    // החזרת השחקן למיקום ההתחלתי
    playerPosition = 65;
    cells[playerPosition].innerHTML = '<span class="player">😀</span>';

    // חידוש הוספת כדורים
    ballCount = 0; // לאפס את מספר הכדורים
    ballInterval = setInterval(addBall, 500); // להתחיל מחדש את הטיימר להוספת כדורים
}

