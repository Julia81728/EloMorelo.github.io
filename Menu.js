
let playerName;

document.addEventListener('DOMContentLoaded', () => {
    function saveName() {
        playerName = document.getElementById("playerName").value;
        localStorage.setItem('playerName', playerName);
        console.log("Player name saved: " + playerName);
    }

    const buttons = document.querySelectorAll('.btn, .button-box button, .box-atk button, .box-items button');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            clickSound.play();
        });
    });
    document.getElementById("saveButton").addEventListener("click", saveName);
});
