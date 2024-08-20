// Variables Needed
let currentAlien;
let currentPlayerTurn;
let attacking = false;
let currentTarget = null;
let p1Turn = true;
let p2Turn = false;
let currentRound = 0;
const horde = [];

// Generate random numbers for alien stats
const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min)) + min;
};

// Player class
class Player {
    constructor(name, hull, firepower, accuracy) {
        this.name = name;
        this.hull = hull;
        this.firepower = firepower;
        this.accuracy = accuracy;
    }

    attack() {
        console.log(`Currently Targeting: ${currentTarget ? currentTarget.name : 'None'}`);
        return this.firepower;
    }
}

// Initialize players
const ussAssembly = new Player("USS_Assembly", 20, 5, 0.7);
const opp1 = new Player("Konan", generateRandomNumber(3, 6), generateRandomNumber(2, 4), generateRandomNumber(0.6, 0.8));
const opp2 = new Player("Kisame", generateRandomNumber(3, 6), generateRandomNumber(2, 4), generateRandomNumber(0.6, 0.8));
const opp3 = new Player("Obito", generateRandomNumber(3, 6), generateRandomNumber(2, 4), generateRandomNumber(0.6, 0.8));
const opp4 = new Player("Nagato", generateRandomNumber(3, 6), generateRandomNumber(2, 4), generateRandomNumber(0.6, 0.8));
const opp5 = new Player("Itachi", generateRandomNumber(3, 6), generateRandomNumber(2, 4), generateRandomNumber(0.6, 0.8));

// Update round display
const clock = document.querySelector(".rndCnt");
const add_round = () => {
    currentRound++;
    clock.innerHTML = currentRound;
};

// Display player’s name
const displayPlayer = (playersName) => {
    let nameHolder = document.querySelector(".goat");
    nameHolder.innerHTML = playersName;
};

// Display current player's turn
const yesOrNo = () => {
    let oracle = document.querySelector(".chance");
    oracle.innerHTML = p1Turn ? "1" : "2";
};

// Toggle player turn
const toggleTurn = () => {
    p1Turn = !p1Turn;
    p2Turn = !p2Turn;
    yesOrNo();
};

// Function to append messages to the battle log
const appendLog = (message) => {
    const log = document.getElementById("log");
    const entry = document.createElement("p");
    entry.textContent = message;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight; // Scroll to the bottom
};

// Update player health display
const updatePlayerHealth = () => {
    const goatHealthElement = document.querySelector(".goatHealth");
    goatHealthElement.textContent = `Hull: ${ussAssembly.hull}`;
};

// Update enemy health display
const updateEnemyHealth = () => {
    const oppHealthElement = document.querySelector(".oppHealth");
    if (horde.length > 0) {
        oppHealthElement.textContent = `Hull: ${horde[0].hull}`;
    } else {
        oppHealthElement.textContent = 'No enemies remaining';
    }
};

// Start game logic
const startGame = () => {
    add_round();
    displayPlayer("USSASSEMBLY");
    // Initialize player health display
    updatePlayerHealth();
    // Generate initial enemies
    generateAlien(opp1);
    generateAlien(opp2);
    generateAlien(opp3);
    generateAlien(opp4);
    generateAlien(opp5);
    // Initialize enemy health display
    updateEnemyHealth();
};

// Reload page (retreat)
const retreat = () => {
    window.location.reload();
};

// Function to handle attacks
const attack = (attacker, target) => {
    if (horde.length === 0) {
        appendLog("No aliens to attack.");
        return;
    }

    if (target.hull > 0) {
        const damage = attacker.attack();
        target.hull -= damage;
        appendLog(`${attacker.name} attacks ${target.name} for ${damage} damage.`);
        // Update health displays after attack
        updatePlayerHealth();
        updateEnemyHealth();
        if (target.hull <= 0) {
            target.hull = 0;
            horde.shift(); // Remove defeated enemy from horde
            appendLog(`${target.name} has been defeated.`);
        }
        endRound();
    }
};

// Function to generate a new alien and add it to the horde
const generateAlien = (alienObj) => {
    let { name, hull, firepower, accuracy } = alienObj;
    let newbie = new Player(name, hull, firepower, accuracy);
    horde.push(newbie);
    appendLog(`New Challenger has arrived: ${name}`);
    console.log("Horde Updated!");
};

// Handle end of round logic
const endRound = () => {
    if (horde.length > 0) {
        // Example logic for enemy attacks or next round
        toggleTurn();
        if (!attacking && p1Turn) {
            // Allow player to attack again or continue to next round
        }
    } else {
        appendLog("All enemies defeated!");
        // Handle end of game scenario
    }
};

// Function to play background audio
const playAudio = () => {
    const audio = document.getElementById("gameAudio");
    if (audio) {
        audio.play().catch(error => {
            console.log('Audio playback was prevented:', error);
        });
    }
};

// Ensure audio plays on page load
window.addEventListener('load', () => {
    playAudio();
});

// Event listener for the fire button
document.getElementById("fireButton").addEventListener("click", () => {
    if (!attacking && p1Turn) {
        if (horde.length > 0) {
            attacking = true;
            currentTarget = horde[0]; // Assuming the first alien is the target
            attack(ussAssembly, currentTarget);
            if (currentTarget.hull > 0) {
                setTimeout(() => {
                    endRound(); // Start enemy attack after player attack
                    attacking = false;
                }, 1000); // Delay for a moment to show the player attack
            } else {
                attacking = false;
            }
            playAudio(); // Play audio on fire button click
        } else {
            appendLog("No aliens to attack.");
        }
    } else if (!p1Turn) {
        appendLog("It's not Player 1's turn.");
    }
});
