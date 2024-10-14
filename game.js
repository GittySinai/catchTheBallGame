const board = document.querySelector('.game-board');
const score = document.querySelector('.score');
const totalCells = 120;
const occupiedCells = new Set();
const cells = [];
let counter = 0

const excludedCells = [24, 107, 109, 10]; // תאים שאותם נרצה לדלג

// יצירת התאים
for (let i = 0; i < totalCells; i++) {
    // אם המספר קיים במערך של התאים שאינם מותרים, דלג עליו
    if (!excludedCells.includes(i)) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        board.appendChild(cell);
        cells.push(cell); // שמירה במערך לצורך גישה נוחה לכל התאים
    } else {
        // להוסיף תא ריק עבור התאים שיש לדלג עליהם כדי לשמור על המבנה
        const cell = document.createElement('div');
        // cell.classList.add('cell', 'excluded'); // קלאס מיוחד לתא ריק
        board.appendChild(cell);
        cells.push(cell);
    }
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

    // מעבר בין תא 25 לתא 106
    if (playerPosition === 25 && newPosition === 24) {
        newPosition = 106; // מעבר שמאלה מתא 25 לתא 106
    } else if (playerPosition === 106 && newPosition === 107) {
        newPosition = 25; // מעבר ימינה מתא 106 לתא 25
    }

    // מעבר בין תא 22 לתא 97
    if (playerPosition === 22 && newPosition === 10) {
        newPosition = 97; // מעבר למעלה מתא 22 לתא 97
    } else if (playerPosition === 97 && newPosition === 109) {
        newPosition = 22; // מעבר למטה מתא 97 לתא 22
    }

    // בדיקה אם המיקום החדש הוא תא חיצוני
    if (isOuterCell(newPosition)) {
        return; // מונע מעבר לתא חיצוני
    }

    // בדיקה אם השחקן אוסף כדור
    if (cells[newPosition].innerHTML.includes('⚽')) {
        counter++;
        score.textContent = counter;
    }

    // עדכון התא הנוכחי והתא החדש
    cells[playerPosition].innerHTML = ''; // תא קודם מתנקה
    playerPosition = newPosition; // עדכון מיקום השחקן
    cells[playerPosition].innerHTML = '<span class="player">😀</span>'; // תא חדש מקבל את השחקן

    // בדיקת ניצחון כאשר כל הכדורים נאספו
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
            if (newPosition - columns >= 0) {
                newPosition -= columns;
            }
            break;
        case 'ArrowDown':
            if (newPosition + columns < totalCells) {
                newPosition += columns;
            }
            break;
        case 'ArrowLeft':
            if (newPosition % columns !== 0) {
                newPosition -= 1;
            }
            break;
        case 'ArrowRight':
            if (newPosition % columns !== columns - 1) {
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

