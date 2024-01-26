var playerName;

document.addEventListener('DOMContentLoaded', () => {
    function saveName() {
        playerName = document.getElementById("playerName");
        console.log("Player name saved: " + playerName);
    }

    document.getElementById("saveButton").addEventListener("click", saveName);
});
