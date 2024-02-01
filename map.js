document.addEventListener("DOMContentLoaded", () => {
  const gridSize = 10;
  let isHiddenContentShown = false;
  let currentTurn = "player";
  let playerHP = 100;
  let enemyHP = 100;
  let encounteredEnemyType = null;
  let damagePotionBonus = 0;
  let kill = 0;
  let score = 0;

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  

  const buttonBox = document.querySelector(".button-box");
  const fightButton = document.getElementById("fightButton");
  const itemsButton = document.getElementById("itemsButton");
  const atkOptions = document.querySelector(".box-atk");
  const itemsOptions = document.querySelector(".box-items");
  const goBackAtkButton = document.getElementById("goBackAtkButton");
  const goBackItemsButton = document.getElementById("goBackItemsButton");
  const RunButton = document.getElementById("runButton");
  const atk1Button = document.getElementById("atk1Button");
  const atk2Button = document.getElementById("atk2Button");
  const atk3Button = document.getElementById("atk3Button");
  const hpPotButton = document.getElementById("hpPotButton");
  const dmgPotButton = document.getElementById("dmgPotButton");
  const killButton = document.getElementById("killButton");

  fightButton.addEventListener("click", function () {
    atkOptions.style.display = "flex";
    itemsOptions.style.display = "none";
    buttonBox.style.display = "none";
  });

  itemsButton.addEventListener("click", function () {
    atkOptions.style.display = "none";
    itemsOptions.style.display = "flex";
    buttonBox.style.display = "none";
  });

  RunButton.addEventListener("click", function () {
    const randomNumber = Math.floor(Math.random() * 100);
    if (randomNumber < 20) {
      resetHealth();
      closeHiddenScreen();
    } else {
      enemyTurn();
    }
  });

  goBackAtkButton.addEventListener("click", function () {
    atkOptions.style.display = "none";
    buttonBox.style.display = "flex";
  });

  goBackItemsButton.addEventListener("click", function () {
    itemsOptions.style.display = "none";
    buttonBox.style.display = "flex";
  });

  atk1Button.addEventListener("click", function () {
    playerAttack(1);
  });

  atk2Button.addEventListener("click", function () {
    playerAttack(2);
  });

  atk3Button.addEventListener("click", function () {
    playerAttack(3);
  });

  hpPotButton.addEventListener("click", function () {
    playerHP += 40;
    playerHP = Math.min(playerHP, 100);
    if (currentTurn === "player") {
      enemyTurn();
    }
    updatePlayerHealthBar();
  });

  dmgPotButton.addEventListener("click", function () {
    if (!isDamagePotionButtonDisabled && currentTurn === "player") {
      damagePotionBonus += 5;
      dmgPotButton.disabled = true;
      isDamagePotionButtonDisabled = true;
      enemyTurn();
    }
  });

  killButton.addEventListener("click", function () {});

  function createMap() {
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const cell = document.createElement("div");
        cell.className = "cell";

        const cellValue = map[i][j];

        if (cellValue === -1) {
          const img = document.createElement("img");
          img.src = "sprite/skala.png";
          img.alt = `Inaccessible cell at row ${i}, column ${j}`;
          cell.appendChild(img);
        } else if (cellValue === 1) {
          const img = document.createElement("img");
          img.src = "sprite/Wrog_1.png";
          img.alt = `Image at row ${i}, column ${j}`;
          cell.appendChild(img);
        } else if (cellValue === 2) {
          const img = document.createElement("img");
          img.src = "sprite/Wrog_2.png";
          img.alt = `Image at row ${i}, column ${j}`;
          cell.appendChild(img);
        } else if (cellValue === 3) {
          const img = document.createElement("img");
          img.src = "sprite/Wrog_3.png";
          img.alt = `Image at row ${i}, column ${j}`;
          cell.appendChild(img);
        } else {
          const img = document.createElement("img");
          img.src = "sprite/tile.png";
          img.alt = `Image at row ${i}, column ${j}`;
          cell.appendChild(img);
        }

        cell.setAttribute("data-row", i);
        cell.setAttribute("data-col", j);
        gameContainer.appendChild(cell);
      }
    }
  }


  //mapa obrażen
  const damageMap = {
    water: {
      1: 5, // Water attack deals 5 damage to water type
      2: 0, // Fire Attack 0 damage to water type
      3: 10, // Plant Attack 10 damage to water type
    },
    fire: {
      1: 10, // Atk 1 deals 10 damage to fire type
      2: 5, // Atk 2 deals 5 damage to fire type
      3: 0, // Atk 3 deals 0 damage to fire type
    },
    flora: {
      1: 0, // Atk 1 deals 0 damage to flora type
      2: 10, // Atk 2 deals 10 damage to flora type
      3: 5, // Atk 3 deals 5 damage to flora type
    },
  };


  //mapa
  const map = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, 0, 0, 0, 0, 0, 0, 0, 0, -1],
    [-1, 0, -1, 0, -1, -1, -1, 0, 0, -1],
    [-1, 0, -1, 0, -1, 0, 0, -1, 0, -1],
    [-1, 0, -1, 0, 0, 0, 0, -1, 0, -1],
    [-1, 2, -1, 0, 0, 0, -1, 0, 0, -1],
    [-1, 0, -1, 0, 1, -1, 0, 0, 0, -1],
    [-1, 3, -1, 0, 0, 0, 0, 0, 0, -1],
    [-1, 0, 1, 0, 0, 0, 0, 0, 0, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  ];

  const gameContainer = document.getElementById("game-container");

  function movePlayer(row, col) {
    if (isHiddenContentShown == false) {
      const playerCell = document.querySelector(".player");
      if (playerCell) {
        const currentRow = parseInt(playerCell.getAttribute("data-row"));
        const currentCol = parseInt(playerCell.getAttribute("data-col"));

        playerCell.classList.remove("player");

        animateMove(currentRow, currentCol, currentRow, currentCol, true);
      }

      const targetCell = document.querySelector(
        `[data-row="${row}"][data-col="${col}"]`,
      );
      targetCell.classList.add("player");

      animateMove(row, col, row, col, false);
    }
  }

  let isDamagePotionButtonDisabled = false;
  function enableDamagePotionButton() {
    dmgPotButton.disabled = false;
    isDamagePotionButtonDisabled = false;
  }

  const ENEMY_TYPES = ["water", "fire", "flora"];

  function animateMove(newRow, newCol, currentRow, currentCol, isMovingOff) {
    const gapcellSize = 50;
    const translateX = 0 - (newCol - currentCol) * gapcellSize + "px";
    const translateY = 0 - (newRow - currentRow) * gapcellSize + "px";
  
    const targetCell = document.querySelector(
      `[data-row="${newRow}"][data-col="${newCol}"]`,
    );
  
    while (targetCell.firstChild) {
      targetCell.removeChild(targetCell.firstChild);
    }
  
    const contentImg = document.createElement("img");
    contentImg.src = isMovingOff ? "sprite/tile.png" : "sprite/Mysz_1.png";
    contentImg.alt = isMovingOff ? "Image after move off" : "Player";
  
    if (!isMovingOff) {
      const rotationAngle = getRotationAngle(currentRow, currentCol, newRow, newCol);
      contentImg.style.transform = `rotate(${rotationAngle}deg)`;
    }
  
    targetCell.appendChild(contentImg);
  
    targetCell.style.setProperty("--translateX", translateX);
    targetCell.style.setProperty("--translateY", translateY);
  }
  
  function getRotationAngle(currentRow, currentCol, newRow, newCol) {
    const dx = newCol - currentCol;
    const dy = newRow - currentRow;
  
    const angle = Math.atan2(dy, dx);
      const degrees = (angle * 180) / Math.PI;
      return degrees + 90;
  }
  
  
  

  const playerHealthBar = document.getElementById("playerHealthFill");
  const enemyHealthBar = document.getElementById("enemyHealthFill");

  function updatePlayerHealthBar() {
    const fillPercentage = (playerHP / 100) * 100;
    playerHealthBar.style.width = `${fillPercentage}%`;
  }

  function updateEnemyHealthBar() {
    const fillPercentage = (enemyHP / 100) * 100;
    enemyHealthBar.style.width = `${fillPercentage}%`;
  }

  function activateFunction() {
    const hiddenScreen = document.getElementById("hiddenScreen");
    hiddenScreen.style.display = "block";
    updatePlayerHealthBar();
    updateEnemyHealthBar();

    isHiddenContentShown = true;

    const playerCell = document.querySelector(".player");
    const playerImage = playerCell.querySelector("img");

    const playerImageClone = playerImage.cloneNode(true);
    playerImageClone.src = "sprite/Walka_1.png";
    playerImageClone.alt = "Player";

    playerImageClone.style.transform = "rotate(0deg)";

    const enemyImage = document.createElement("img");
    enemyImage.src = getEnemyImagePath();
    enemyImage.alt = "Enemy";

    enemyImage.style.position = "absolute";
    enemyImage.style.top = "100px";
    enemyImage.style.right = "20px";

    playerImageClone.style.position = "absolute";
    playerImageClone.style.bottom = "100px";
    playerImageClone.style.left = "20px";
    playerImageClone.style.height= "100px";

    const hiddenContent = document.querySelector(".hidden-content");
    hiddenContent.innerHTML = "";
    hiddenContent.appendChild(playerImageClone);
    hiddenContent.appendChild(enemyImage);
    hiddenContent.appendChild(atkOptions);
    hiddenContent.appendChild(itemsOptions);
    hiddenContent.appendChild(buttonBox);
  }

  function enemyTurn() {
    console.log("enemyTurn");
    if (encounteredEnemyType) {
      let damage;
      switch (encounteredEnemyType) {
        case "water":
          damage = getRandomInt(4, 12);
          break;
        case "fire":
          damage = getRandomInt(2, 18);
          break;
        case "flora":
          damage = getRandomInt(8, 10);
          break;
        default:
          damage = 0;
          break;
      }

      playerHP -= damage;

      if (enemyHP <= 0 || playerHP <= 0) {
        endCombat();
      }
      updatePlayerHealthBar();
    }
  }

  function playerAttack(attackType) {
    const playerCell = document.querySelector(".player");
    const newRow = parseInt(playerCell.getAttribute("data-row"));
    const newCol = parseInt(playerCell.getAttribute("data-col"));

    const damage = calculateDamage(attackType, encounteredEnemyType);
    const totalDamage = damage + damagePotionBonus;
    console.log("Damage calculated:", totalDamage);
    enemyHP -= totalDamage;
    updateEnemyHealthBar();

    if (enemyHP <= 0) {
      score = score + 1;
      endCombat();
      resetHealth();
    } else {
      enemyTurn();
    }

    animateMove(newRow, newCol, newRow, newCol, false);
  }

  function getEnemyImagePath() {
    const playerCell = document.querySelector(".player");
    const currentRow = parseInt(playerCell.getAttribute("data-row"));
    const currentCol = parseInt(playerCell.getAttribute("data-col"));
    const enemyType = map[currentRow][currentCol];

    switch (enemyType) {
      case 1:
        return "sprite/Wrog_Walka_Water.png";
      case 2:
        return "sprite/Wrog_Walka_Fire.png";
      case 3:
        return "sprite/Wrog_Walka_Flora.png";
      default:
        return "sprite/default_enemy.png";
    }
  }

  function getEnemyType(row, col) {
    const enemyType = map[row][col];

    switch (enemyType) {
      case 1:
        return "water";
      case 2:
        return "fire";
      case 3:
        return "flora";
      default:
        return "unknown";
    }
  }

  function resetHealth() {
    console.log("reset succesfully health");

    playerHP = 100;
    enemyHP = 100;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function calculateDamage(attackType, enemyType) {
    console.log(
      "Calculating damage. Attack Type:",
      attackType,
      "Enemy Type:",
      enemyType,
    );

    if (
      damageMap[enemyType] &&
      damageMap[enemyType][attackType] !== undefined
    ) {
      const damage = damageMap[enemyType][attackType];
      return damage;
    } else {
      console.log(
        "Invalid attack or enemy type. Returning default damage (0).",
      );
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

  const playerName = localStorage.getItem('playerName');
  console.log(playerName);

function showVictoryScreen() {
  const fullscreenOverlay = document.createElement("div");
  fullscreenOverlay.className = "fullscreen-overlay";

  const victoryContainer = document.createElement("div");
  victoryContainer.className = "victory-container";

  const victoryText = document.createElement("h1");
  victoryText.textContent = "Victory";

  const playerNameElement = document.createElement("p");
  playerNameElement.textContent = "Player: " + playerName;

  const scoreElement = document.createElement("p");
  scoreElement.textContent = "Score: " + score;

  victoryContainer.appendChild(victoryText);
  victoryContainer.appendChild(playerNameElement);
  victoryContainer.appendChild(scoreElement);

  fullscreenOverlay.appendChild(victoryContainer);

  document.body.appendChild(fullscreenOverlay);

  fullscreenOverlay.style.display = "flex";
}


  function showGameOverScreen() {
    console.log("Game Over");
    updateEnemyHealthBar();
    updatePlayerHealthBar();
    gameOverScreen.style.display = "block";
  }
  
  function endCombat() {
      console.log("Combat ended!");
  
      if (playerHP <= 0) {
          showGameOverScreen();
      } else if (enemyHP <= 0) {
          closeHiddenScreen();
      }
  
      isPlayerTurn = true;
  }
  

  function closeHiddenScreen() {
    enableDamagePotionButton();
    damagePotionBonus = 0;
    const hiddenScreen = document.getElementById("hiddenScreen");
    document.getElementById("hiddenScreen").style.display = "none";
    isHiddenContentShown = false;
    if (checkVictory()) {
      showVictoryScreen();
  }
  }
   function handleKeyPress(event) {
    if (isHiddenContentShown == false) {
      const playerCell = document.querySelector(".player");
      const currentRow = parseInt(playerCell.getAttribute("data-row"));
      const currentCol = parseInt(playerCell.getAttribute("data-col"));

      let newRow = currentRow;
      let newCol = currentCol;

      switch (event.key) {
        case "ArrowUp":
          newRow = Math.max(0, currentRow - 1);
          break;
        case "ArrowDown":
          newRow = Math.min(gridSize - 1, currentRow + 1);
          break;
        case "ArrowLeft":
          newCol = Math.max(0, currentCol - 1);
          break;
        case "ArrowRight":
          newCol = Math.min(gridSize - 1, currentCol + 1);
          break;
        default:
          return;
      }
      


      if (map[newRow][newCol] !== -1) {
        //sleep(500);
        movePlayer(newRow, newCol);
        animateMove(newRow, newCol, currentRow, currentCol);
        if (
          map[newRow][newCol] === 1 ||
          map[newRow][newCol] === 2 ||
          map[newRow][newCol] === 3
        ) {
          encounteredEnemyType = getEnemyType(newRow, newCol);
          console.log("Encountered enemy of type:", encounteredEnemyType);
          activateFunction();
          map[newRow][newCol] = 0;
          /*
          const argetCtell = document.querySelector(
            `[data-row="${newRow}"][data-col="${newCol}"]`,            
          ); 
          targetCell.innerText = map[newRow][newCol];*/
        }
      }

    }
  }

  createMap();
  movePlayer(8, 1);
  window.addEventListener("keydown", handleKeyPress);
});