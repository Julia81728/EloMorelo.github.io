
document.addEventListener('DOMContentLoaded', () => {

    const gridSize = 10;
    let isHiddenContentShown = false;
    let currentTurn = 'player'; 
    let playerHP = 100; 
    let enemyHP = 100;
    let encounteredEnemyType = null;
    let damagePotionBonus = 0;
    let kill=0;
    let score=0;
    

    function createMap() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
    
                const cellValue = map[i][j];
    
                if (cellValue === -1) {
                    const img = document.createElement('img');
                    img.src = 'sprite/skala.png';
                    img.alt = `Inaccessible cell at row ${i}, column ${j}`;
                    cell.appendChild(img);
                } else if (cellValue === 1) {
                    const img = document.createElement('img');
                    img.src = 'sprite/Wrog_1.png';
                    img.alt = `Image at row ${i}, column ${j}`;
                    cell.appendChild(img);
                } else if (cellValue === 2) {
                    const img = document.createElement('img');
                    img.src = 'sprite/Wrog_2.png'; 
                    img.alt = `Image at row ${i}, column ${j}`;
                    cell.appendChild(img);
                } else if (cellValue === 3) {
                    const img = document.createElement('img');
                    img.src = 'sprite/Wrog_3.png'; 
                    img.alt = `Image at row ${i}, column ${j}`;
                    cell.appendChild(img);
                } else {
                    const img = document.createElement('img');
                    img.src = 'sprite/tile.png';
                    img.alt = `Image at row ${i}, column ${j}`;
                    cell.appendChild(img);
                }
    
                cell.setAttribute('data-row', i);
                cell.setAttribute('data-col', j);
                gameContainer.appendChild(cell);
            }
        }
    }



    const damageMap = {
        water: {
            1: 5, // Atk 1 deals 5 damage to water type
            2: 0, // Atk 2 deals 0 damage to water type
            3: 10  // Atk 3 deals 10 damage to water type
        },
        fire: {
            1: 10, // Atk 1 deals 10 damage to fire type
            2: 5,  // Atk 2 deals 5 damage to fire type
            3: 0   // Atk 3 deals 0 damage to fire type
        },
        flora: {
            1: 0,  // Atk 1 deals 0 damage to flora type
            2: 10, // Atk 2 deals 10 damage to flora type
            3: 5   // Atk 3 deals 5 damage to flora type
        }
    };



    const map = [
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
        [-1, 1, 0, 0, 3, 0, 0, 0, 0, -1],
        [-1, 0, -1, 0, -1, -1, -1, 0, 0, -1],
        [-1, 3, -1, 0, -1, 0, 0, -1, 0, -1],
        [-1, 0, -1, 0, 0, 2, 0, -1, 0, -1],
        [-1, 0, -1, 0, 0, 3, -1, 0, 0, -1],
        [-1, 2, -1, 0, 1, -1, 2, 1, 0, -1],
        [-1, 0, -1, 1, 0, 0, 0, 0, 0, -1],
        [-1, 0, -1, 0, 0, 0, 2, 0, 3, -1],
        [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1]
    ];

    
const gameContainer = document.getElementById('game-container');




function movePlayer(row, col) {
    if(isHiddenContentShown==false) {
    const playerCell = document.querySelector('.player');
    if (playerCell) {
        const currentRow = parseInt(playerCell.getAttribute('data-row'));
        const currentCol = parseInt(playerCell.getAttribute('data-col'));

        playerCell.classList.remove('player');

        animateMove(currentRow, currentCol, currentRow, currentCol, true);
    }

    const targetCell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    targetCell.classList.add('player');

    animateMove(row, col, row, col, false);
    if (checkVictory()) {
        showVictoryScreen();
    }
}
}


function showVictoryScreen() {
    alert('Victory! You have defeated all enemies!');
}



    const ENEMY_TYPES = ['water', 'fire', 'flora'];


    function animateMove(newRow, newCol, currentRow, currentCol, isMovingOff) {
        const cellSize = 55; // zależne od wielkości komórki
        const translateX = 0 - (newCol - currentCol) * cellSize + 'px';
        const translateY = 0 - (newRow - currentRow) * cellSize + 'px';
    
        const targetCell = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
    
        while (targetCell.firstChild) {
            targetCell.removeChild(targetCell.firstChild);
        }
    
        const contentImg = document.createElement('img');
        contentImg.src = isMovingOff ? 'sprite/tile.png' : 'sprite/Mysz_1.png';
        contentImg.alt = isMovingOff ? 'Image after move off' : 'Player';
    
        targetCell.appendChild(contentImg);
    
        targetCell.style.setProperty('--translateX', translateX);
        targetCell.style.setProperty('--translateY', translateY);
    }
    
    const playerHealthBar = document.getElementById('playerHealthFill');
    const enemyHealthBar = document.getElementById('enemyHealthFill');
    
    function updatePlayerHealthBar() {
        const fillPercentage = (playerHP / 100) * 100; 
        playerHealthBar.style.width = `${fillPercentage}%`;
      }
      
      function updateEnemyHealthBar() {
        const fillPercentage = (enemyHP / 100) * 100; 
        enemyHealthBar.style.width = `${fillPercentage}%`;
      }



    function activateFunction() {
        const hiddenScreen = document.getElementById('hiddenScreen');
        hiddenScreen.style.display = 'block';

        const buttonBox = document.querySelector('.button-box');
        const fightButton = document.getElementById('fightButton');
        const itemsButton = document.getElementById('itemsButton');
        const atkOptions = document.querySelector('.box-atk');
        const itemsOptions = document.querySelector('.box-items');
        const goBackAtkButton = document.getElementById('goBackAtkButton');
        const goBackItemsButton = document.getElementById('goBackItemsButton');
        const RunButton = document.getElementById('runButton');
        

        updatePlayerHealthBar();
        updateEnemyHealthBar();

        fightButton.addEventListener('click', function () {
            atkOptions.style.display = 'flex';
            itemsOptions.style.display = 'none';
            buttonBox.style.display = 'none'; 
        });

        itemsButton.addEventListener('click', function () {
            atkOptions.style.display = 'none';
            itemsOptions.style.display = 'flex';
            buttonBox.style.display = 'none'; 
        });

        RunButton.addEventListener('click', function () {
            const randomNumber = Math.floor(Math.random() * 100);
            if (randomNumber < 20) {
                resetHealth();
                closeHiddenScreen();
            } else {
                enemyTurn();
            }
        });
        
        goBackAtkButton.addEventListener('click', function () {
        atkOptions.style.display = 'none';
        buttonBox.style.display = 'flex'; 
        });

        goBackItemsButton.addEventListener('click', function () {
        itemsOptions.style.display = 'none';
        buttonBox.style.display = 'flex'; 
        });
        
        const atk1Button = document.getElementById('atk1Button');
        const atk2Button = document.getElementById('atk2Button');
        const atk3Button = document.getElementById('atk3Button');
        const hpPotButton = document.getElementById('hpPotButton');
        const dmgPotButton = document.getElementById('dmgPotButton');
        const killButton = document.getElementById('killButton');



        atk1Button.addEventListener('click', function () {
            playerAttack(1);
        });

        atk2Button.addEventListener('click', function () {
            playerAttack(2);
        });

        atk3Button.addEventListener('click', function () {
            playerAttack(3);
        });
        
        hpPotButton.addEventListener('click', function () {
            playerHP += 40;
            playerHP = Math.min(playerHP, 100);
            if (currentTurn === 'player') {
                switchTurn();
            }
            updatePlayerHealthBar();
        });

        

        dmgPotButton.addEventListener('click', function () {
            damagePotionBonus += 5;
            if (currentTurn === 'player') {
                switchTurn();
            }
        });

        killButton.addEventListener('click', function () {

        });




        isHiddenContentShown = true;
   
        const playerCell = document.querySelector('.player');
        const playerImage = playerCell.querySelector('img');
    
      
        const playerImageClone = playerImage.cloneNode(true);
        playerImageClone.src = "sprite/Mysz_Walka_1.png"; 
        playerImageClone.alt = 'Player';
    
        const enemyImage = document.createElement('img');
        enemyImage.src = getEnemyImagePath(); 
        enemyImage.alt = 'Enemy';
    
        enemyImage.style.position = 'absolute';
        enemyImage.style.top = '100px';
        enemyImage.style.right = '20px';
    
        playerImageClone.style.position = 'absolute';
        playerImageClone.style.bottom = '170px';
        playerImageClone.style.left = '20px';
        
        const hiddenContent = document.querySelector('.hidden-content');
        hiddenContent.innerHTML = '';
        hiddenContent.appendChild(playerImageClone);
        hiddenContent.appendChild(enemyImage);
        hiddenContent.appendChild(atkOptions); 
        hiddenContent.appendChild(itemsOptions);
        hiddenContent.appendChild(buttonBox);
    }
    




    function enemyTurn() {
        if (encounteredEnemyType) {
            let damage;
            switch (encounteredEnemyType) {
                case 'water':
                    damage = getRandomInt(4, 12);
                    break;
                case 'fire':
                    damage = getRandomInt(2, 18);
                    break;
                case 'flora':
                    damage = getRandomInt(8, 10);
                    break;
                default:
                    damage = 0;
                    break;
            }
    
            playerHP -= damage;
    
            if (enemyHP <= 0 || playerHP <= 0) {
                endCombat();
            } else {
                switchTurn();
            }
            updatePlayerHealthBar();    
        }
    }

    function playerAttack(attackType) {
        const playerCell = document.querySelector('.player');
        const newRow = parseInt(playerCell.getAttribute('data-row'));
        const newCol = parseInt(playerCell.getAttribute('data-col'));
    
        const damage = calculateDamage(attackType, encounteredEnemyType);
        const totalDamage = damage + damagePotionBonus;
        console.log('Damage calculated:', totalDamage);
        enemyHP -= totalDamage;
        updateEnemyHealthBar();

        if (enemyHP <= 0) {
            score=score+1;
            endCombat();
            resetHealth();
        } else {
            switchTurn();
        }
    
        animateMove(newRow, newCol, newRow, newCol, false);
    }


    function getEnemyImagePath() {
        const playerCell = document.querySelector('.player');
        const currentRow = parseInt(playerCell.getAttribute('data-row'));
        const currentCol = parseInt(playerCell.getAttribute('data-col'));
        const enemyType = map[currentRow][currentCol]; 
    
       
        switch (enemyType) {
            case 1:
                return 'sprite/Wrog_Walka_Water.png';
            case 2:
                return 'sprite/Wrog_Walka_Fire.png';
            case 3:
                return 'sprite/Wrog_Walka_Flora.png';
            default:
                return 'sprite/default_enemy.png'; 
        }
    }
    
    function getEnemyType(row, col) {
        const enemyType = map[row][col];
    
        switch (enemyType) {
            case 1:
                return 'water';
            case 2:
                return 'fire';
            case 3:
                return 'flora';
            default:
                return 'unknown';
        }
    }
    



    

    
    
    function switchTurn() {
        currentTurn = currentTurn === 'player' ? 'enemy' : 'player';
        if (currentTurn === 'enemy') {
            enemyTurn(); 
        }
    }
    

    
    function resetHealth() {
        playerHP = 100;
        enemyHP = 100;
    }


    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    

    

    
    
    
    
    function calculateDamage(attackType, enemyType) {
        console.log('Calculating damage. Attack Type:', attackType, 'Enemy Type:', enemyType);
    
    
        if (damageMap[enemyType] && damageMap[enemyType][attackType] !== undefined) {
            const damage = damageMap[enemyType][attackType];
            return damage;
        } else {
            console.log('Invalid attack or enemy type. Returning default damage (0).');
            return 0;
        }
    }
    
    function checkVictory() {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                if (map[i][j] === 1 || map[i][j] === 2 || map[i][j] === 3) {
                    return false;
                }
            }
        }
        return true;
    }
    

    function showGameOverScreen() {
        console.log('Game Over');
        gameOverScreen.style.display = 'block';
}

    
    function endCombat() {
        console.log('Combat ended!');
    
        if (playerHP <= 0) {
            showGameOverScreen();
        } else if (enemyHP <= 0) {
            closeHiddenScreen();
        }
    
        isPlayerTurn = true;
    }
    
    
    function closeHiddenScreen() {
        damagePotionBonus = 0;
        const hiddenScreen = document.getElementById('hiddenScreen');
        document.getElementById('hiddenScreen').style.display = 'none';
        isHiddenContentShown = false;
        resetHealth();
    }
    
    
    
    function handleKeyPress(event) {
        if (isHiddenContentShown == false) {
            const playerCell = document.querySelector('.player');
            const currentRow = parseInt(playerCell.getAttribute('data-row'));
            const currentCol = parseInt(playerCell.getAttribute('data-col'));
    
            let newRow = currentRow;
            let newCol = currentCol;
    
            switch (event.key) {
                case 'ArrowUp':
                    newRow = Math.max(0, currentRow - 1);
                    break;
                case 'ArrowDown':
                    newRow = Math.min(gridSize - 1, currentRow + 1);
                    break;
                case 'ArrowLeft':
                    newCol = Math.max(0, currentCol - 1);
                    break;
                case 'ArrowRight':
                    newCol = Math.min(gridSize - 1, currentCol + 1);
                    break;
                default:
                    return;
            }
    
            if (map[newRow][newCol] !== -1) {
                movePlayer(newRow, newCol);
                animateMove(newRow, newCol, currentRow, currentCol);
    
                if (map[newRow][newCol] === 1 || map[newRow][newCol] === 2 || map[newRow][newCol] === 3) {
                    encounteredEnemyType = getEnemyType(newRow, newCol);
                    console.log('Encountered enemy of type:', encounteredEnemyType);
                    activateFunction();
                    map[newRow][newCol] = 0;
                    const targetCell = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
                    targetCell.innerText = map[newRow][newCol];
                }
            }
        }
    }
    
    
    
    createMap();
    movePlayer(8, 1);
    window.addEventListener('keydown', handleKeyPress)
    
});

























