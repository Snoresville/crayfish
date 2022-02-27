// Game Settings
const maxPots = 50;

// Current Game
let pots = 10;
let money = 0;

// Mechanics
const diceImage = $("#CrayfishDice");

function DiceRollValue() {
    return Math.floor(Math.random() * 6) + 1;
}

function RollDice() {
    Game.EmitSound("dice");

    const result = DiceRollValue();

    for (let i = 0; i <= 5; i++) {
        $.Schedule(i * 0.1, () => SetDiceImage(DiceRollValue()));
    }

    $.Schedule(1, () => SetDiceImage(result));
}

let lastDice = 0;
function SetDiceImage(roll) {
    diceImage.SetHasClass(`Roll${lastDice}`, false);
    diceImage.SetHasClass(`Roll${roll}`, true);

    lastDice = roll;
}
