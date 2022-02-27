// Debug
const debug = false;
if (!debug) {
    $("#CrayfishMenu").SetHasClass("Invisible", false);
    $("#CrayfishGame").SetHasClass("Invisible", true);
} else {
    $("#CrayfishMenu").SetHasClass("Invisible", true);
    $("#CrayfishGame").SetHasClass("Invisible", false);
}

// Game Constants
const maxPots = 50;
const crayfishPrice = 10;
const potPrice = 50;
const crayfishGains = [
    [1, 2],
    [2, 5],
    ["lose", "lose"],
    [0, 2],
    [2, "lose"],
    [1, 1],
];

// Current Game
let pots = 10;
let money = 0;
let currentDay = 1;

// Update
const shallowPots = $("#ShallowPots");
const deepPots = $("#DeepPots");
function OnCrayfishPotsPlaced(location) {
    const panelLocation = $(`#${location}`);

    if (isNaN(parseInt(panelLocation.text))) {
        panelLocation.text = 0;
    } else {
        panelLocation.text = parseInt(panelLocation.text);
    }

    UpdateRollStatus();
}

const resourceMoney = $("#CrayfishResourcesMoney");
const resourcePots = $("#CrayfishResourcesPots");
function UpdateResourceCounts() {
    resourceMoney.text = `Money: $${money}`;
    resourcePots.text = `Pots: ${pots}`;
}

const rollStatusBar = $("#CrayfishRollChecker");
const rollStatusText = $("#CrayfishRollCheckerStatus");
let rollStatus = false;
function UpdateRollStatus() {
    rollStatus = true;
    // $.Msg(shallowPots.text);
    // $.Msg(deepPots.text);

    const totalPotsPlanned =
        parseInt(shallowPots.text) + parseInt(deepPots.text);

    if (isNaN(totalPotsPlanned)) {
        rollStatus = false;
        rollStatusText.text = "Need inputs for both regions!";
    }

    if (totalPotsPlanned > pots) {
        rollStatus = false;
        rollStatusText.text = "Placed pots exceeds pot count!";
    }

    if (rollStatus) {
        rollStatusText.text = "All Good!";
    }
    rollStatusBar.SetHasClass("Bad", !rollStatus);
}

function FullUpdate() {
    UpdateResourceCounts();
    UpdateRollStatus();
}

// Mechanics
let currentlyRolling = false;
function RollDice() {
    if (!rollStatus || currentlyRolling) return;
    currentlyRolling = true;

    UpdateRollStatus();

    Game.EmitSound("dice");

    const result = DiceRollValue();
    for (let i = 0; i <= 5; i++) {
        $.Schedule(i * 0.1, () => SetDiceImage(DiceRollValue()));
    }

    $.Schedule(1, () => {
        SetDiceImage(result);
        RollResult(result);
        currentDay++;
    });
}

const history = $("#CrayfishHistory");
function RollResult(value) {
    const rollValues = crayfishGains[value - 1];

    const shallowPotCount = parseInt(shallowPots.text);
    const deepPotCount = parseInt(deepPots.text);

    let lostPots = 0;
    let crayfish = 0;

    if (rollValues[0] == "lose") {
        lostPots += shallowPotCount;
    } else {
        crayfish += rollValues[0] * shallowPotCount;
    }

    if (rollValues[1] == "lose") {
        lostPots += deepPotCount;
    } else {
        crayfish += rollValues[1] * deepPotCount;
    }

    shallowPots.text = "";
    deepPots.text = "";

    money += crayfish * crayfishPrice;
    pots -= lostPots;
    currentlyRolling = false;

    FullUpdate();

    WriteHistoryLine(`---[ Day ${currentDay} (${value}) ]---`);
    if (lostPots > 0) WriteHistoryLine(`Lost ${lostPots} pots...`);
    WriteHistoryLine(
        `Got ${crayfish} Crayfish! (+$${crayfish * crayfishPrice})`
    );
}

function PurchasePot() {
    if (money < potPrice) return;

    pots++;
    money -= potPrice;
    UpdateResourceCounts();
}

// Misc
function DiceRollValue() {
    return Math.floor(Math.random() * 6) + 1;
}

let lastDice = 0;
const diceImage = $("#CrayfishDice");
function SetDiceImage(roll) {
    diceImage.SetHasClass(`Roll${lastDice}`, false);
    diceImage.SetHasClass(`Roll${roll}`, true);

    lastDice = roll;
}

function WriteHistoryLine(newString) {
    const newLine = $.CreatePanel("Label", history, ``);
    newLine.text = newString;
}

// Start Updating
FullUpdate();
