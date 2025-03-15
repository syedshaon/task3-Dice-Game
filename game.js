// No prameter
// node game.js
// Invalid dice configuration "2,2,4,5,9,f". All values must be integers.
// node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3 2,2,4,5,9,f
// Less than 3 dice configurations are required.
// node game.js 2,2,4,4,9,9 6,8,1,1,8,6
// 4 identiccal dices
// node game.js 1,2,3,4,5,6 1,2,3,4,5,6 1,2,3,4,5,6 1,2,3,4,5,6
// 3 dices
// node game.js 2,2,4,4,9,9 1,1,6,6,8,8 3,3,5,5,7,7
// More than 10 doce to show pagination in helptable
// node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3 2,2,4,5,9,9 6,8,1,6,8,6 7,5,3,7,5,6 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3 2,2,4,4,9,9 6,8,1,1,8,6

const crypto = require("crypto");
const Table = require("cli-table");
const prompt = require("prompt-sync")(); // For user input

// To find the computer's number from the HMAC
function recreateHMAC(key, message) {
  return crypto.createHmac("sha3-256", key).update(message.toString()).digest("hex");
}

function findComputerNumber(hmac, key, range) {
  for (let x = 0; x < range; x++) {
    const computedHMAC = recreateHMAC(key, x);
    if (computedHMAC === hmac) {
      return x; // Found the computer's number
    }
  }
  throw new Error("No matching HMAC found. Invalid key or HMAC.");
}

// To find the computer's number from the HMAC ENDS

class Dice {
  constructor(values) {
    this.values = values;
  }

  roll(index) {
    return this.values[index];
  }
}

class FairRandom {
  static generateSecureKey() {
    return crypto.randomBytes(32).toString("hex");
  }

  static generateHMAC(key, message) {
    return crypto.createHmac("sha3-256", key).update(message.toString()).digest("hex");
  }

  static generateFairRandom(range) {
    const key = FairRandom.generateSecureKey();
    const x = crypto.randomInt(range);
    const hmac = FairRandom.generateHMAC(key, x);
    return { key, x, hmac };
  }

  static calculateResult(x, y, range) {
    return (x + y) % range;
  }
}

class ProbabilityCalculator {
  static calculateWinProbability(diceA, diceB) {
    let wins = 0;
    const total = diceA.values.length * diceB.values.length;

    diceA.values.forEach((a) => {
      diceB.values.forEach((b) => {
        if (a > b) wins++;
      });
    });

    return wins / total;
  }
}
class HelpTable {
  static generateTable(diceList, page = 1, pageSize = 10) {
    const totalPages = Math.ceil(diceList.length / pageSize);
    if (page < 1 || page > totalPages) {
      console.log(`Invalid page number. Please choose a page between 1 and ${totalPages}.`);
      return;
    }

    const startIndex = (page - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, diceList.length);
    const paginatedDiceList = diceList.slice(startIndex, endIndex);

    const table = new Table({
      head: ["User Dice \\ Computer Dice", ...paginatedDiceList.map((_, i) => `Dice ${startIndex + i + 1}`)],
    });

    diceList.forEach((diceA, i) => {
      const row = [`Dice ${i + 1}`];
      paginatedDiceList.forEach((diceB, j) => {
        if (i === startIndex + j) {
          row.push("-");
        } else {
          const prob = ProbabilityCalculator.calculateWinProbability(diceA, diceB);
          row.push(prob.toFixed(4));
        }
      });
      table.push(row);
    });

    console.log("Help Table");
    console.log(`Page ${page} of ${totalPages}:`);
    console.log(table.toString());

    if (totalPages > 1) {
      console.log(`Use 'n' for next page, 'p' for previous page, or 'q' to quit.`);
      const input = prompt("Your selection: ").trim().toLowerCase();
      if (input === "n" && page < totalPages) {
        this.generateTable(diceList, page + 1, pageSize);
      } else if (input === "p" && page > 1) {
        this.generateTable(diceList, page - 1, pageSize);
      } else if (input === "q") {
        console.log("Returning to the game.");
        return; // Explicitly return to avoid printing "undefined"
      } else {
        console.log("Invalid input. Returning to the game.");
      }
    }
  }
}

class HelpTableOld {
  static generateTable(diceList) {
    const table = new Table({
      head: ["User Dice \\ Computer Dice", ...diceList.map((_, i) => `Dice ${i + 1}`)],
      chars: { top: "═", "top-mid": "╤", "top-left": "╔", "top-right": "╗", bottom: "═", "bottom-mid": "╧", "bottom-left": "╚", "bottom-right": "╝", left: "║", "left-mid": "╟", mid: "─", "mid-mid": "┼", right: "║", "right-mid": "╢", middle: "│" },
      style: { "padding-left": 0, "padding-right": 0 },
    });

    diceList.forEach((diceA, i) => {
      const row = [`Dice ${i + 1}`];
      diceList.forEach((diceB, j) => {
        if (i === j) {
          row.push("-");
        } else {
          const prob = ProbabilityCalculator.calculateWinProbability(diceA, diceB);
          row.push(prob.toFixed(4));
        }
      });
      table.push(row);
    });

    return table.toString();
  }
}

class DiceGame {
  constructor(diceList) {
    this.diceList = diceList;
  }

  determineFirstMove() {
    const { key, x, hmac } = FairRandom.generateFairRandom(2);
    console.log(`Computer selected a random value in the range 0..1 (HMAC=${hmac}).`);
    //
    //
    //
    // console.log(`Secret: Computer's selection is ${x}.`); // Print the computer's selection for debugging
    //
    //
    //
    console.log("Try to guess computer's selection.");
    console.log("0 - 0");
    console.log("1 - 1");
    console.log("X - exit");
    console.log("? - help");

    const userSelection = this.getUserInput(["0", "1", "X", "?"]);
    if (userSelection === "X") return null;
    if (userSelection === "?") {
      HelpTable.generateTable(this.diceList);
      return this.determineFirstMove();
    }

    // const result = FairRandom.calculateResult(x, parseInt(userSelection), 2);
    const correctGuess = parseInt(userSelection) === x;
    console.log(`Computer's selection: ${x} (KEY=${key}).`);

    //
    //
    //
    // const computerNumberFromHmac = findComputerNumber(hmac, key, 2);
    // console.log(`Computer's number From Hmac is: ${computerNumberFromHmac}`);
    //
    //
    //

    return correctGuess ? "user" : "computer";
  }

  getUserInput(validOptions) {
    while (true) {
      const input = prompt("Your selection: ").trim().toUpperCase();
      if (validOptions.includes(input)) return input;
      console.log("Invalid input. Please try again.");
    }
  }

  selectDice(player) {
    // console.log(`${player === "computer" ? "Choose a dice for computer:" : "Choose a dice for You:"} `);
    console.log("Choose a dice for You:");
    this.diceList.forEach((dice, index) => {
      console.log(`${index} - [${dice.values.join(",")}]`);
    });
    console.log("X - exit");
    console.log("? - help");

    const selection = this.getUserInput([...this.diceList.map((_, i) => i.toString()), "X", "?"]);
    if (selection === "X") return null;
    if (selection === "?") {
      HelpTable.generateTable(this.diceList);
      return this.selectDice(player);
    }

    return parseInt(selection);
  }

  computerSelectsDice(excludedIndex) {
    // Filter out the excluded dice (the one selected by the user)
    const availableDiceIndices = this.diceList
      .map((_, index) => index) // Create an array of indices [0, 1, 2, ...]
      .filter((index) => index !== excludedIndex); // Exclude the user's selected dice

    // Randomly select one of the available dice
    const randomIndex = crypto.randomInt(availableDiceIndices.length);
    const computerDiceIndex = availableDiceIndices[randomIndex];
    const computerDice = this.diceList[computerDiceIndex];

    console.log(`Computer selects the [${computerDice.values.join(",")}] dice.`);
    return computerDiceIndex;
  }

  performThrow(dice, player) {
    const range = dice.values.length;
    const { key, x, hmac } = FairRandom.generateFairRandom(range);
    console.log(`Computer selected a random value in the range 0..${range - 1} (HMAC=${hmac}).`);
    //
    //
    //
    // console.log(`Secret: Computer's selection is ${x}.`); // Print the computer's selection for debugging
    //
    //
    //
    console.log(`Add your number modulo ${range}.`);
    for (let i = 0; i < range; i++) console.log(`${i} - ${i}`);
    console.log("X - exit");
    console.log("? - help");

    const validOptions = [...Array(range).keys()].map((i) => i.toString());
    validOptions.push("X", "?");

    const userSelection = this.getUserInput(validOptions);
    if (userSelection === "X") return null;
    if (userSelection === "?") {
      HelpTable.generateTable(this.diceList);
      return this.performThrow(dice, player);
    }

    const result = FairRandom.calculateResult(x, parseInt(userSelection), range);
    console.log(`Computer's number is ${x} (KEY=${key}).`);
    console.log(`The result is ${x} + ${userSelection} = ${result} (mod ${range}).`);
    const throwResult = dice.roll(result);
    console.log(`${player === "computer" ? "Computer's" : "Your"} throw is ${throwResult}.`);

    return throwResult;
  }

  play() {
    console.log("Welcome to the Non-Transitive Dice Game!");
    const firstMove = this.determineFirstMove();
    if (!firstMove) return;

    let computerDiceIndex, userDiceIndex;

    if (firstMove === "computer") {
      console.log("Computer selects dice first. . . . .");
      // Computer selects a dice first
      computerDiceIndex = this.computerSelectsDice();

      // User selects a dice (must be different from the computer's selection)
      userDiceIndex = this.selectDice("user");
      if (userDiceIndex === null || userDiceIndex === computerDiceIndex) {
        console.log("Invalid selection. Please choose a different dice.");
        return;
      }
    } else {
      console.log("You selects dice first.");
      // User selects a dice first
      userDiceIndex = this.selectDice("user");
      if (userDiceIndex === null) return;

      // Computer selects a dice (must be different from the user's selection)
      computerDiceIndex = this.computerSelectsDice(userDiceIndex);
    }

    const computerDice = this.diceList[computerDiceIndex];
    const userDice = this.diceList[userDiceIndex];

    // console.log(`Computer choose the [${computerDice.values.join(",")}] dice.`);
    console.log(`You have the [${userDice.values.join(",")}] dice.`);

    // Perform throws
    console.log("Computer's throw:");
    const computerThrow = this.performThrow(computerDice, "computer");
    if (computerThrow === null) return;

    console.log("Your throw:");
    const userThrow = this.performThrow(userDice, "user");
    if (userThrow === null) return;

    // Determine the winner
    if (userThrow > computerThrow) {
      console.log(`You win! (${userThrow} > ${computerThrow})`);
    } else if (userThrow < computerThrow) {
      console.log(`Computer wins! (${userThrow} < ${computerThrow})`);
    } else {
      console.log(`It's a tie!  (${userThrow} === ${computerThrow})`);
    }
  }
}

// Main script
const args = process.argv.slice(2);
if (args.length < 3) {
  console.error("Error: At least 3 dice configurations are required.");
  console.error("Example: node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3");
  process.exit(1);
}

const diceList = args.map((arg) => {
  const values = arg.split(",").map(Number);
  if (values.some(isNaN)) {
    console.error(`Error: Invalid dice configuration "${arg}". All values must be integers.`);
    process.exit(1);
  }
  return new Dice(values);
});

const game = new DiceGame(diceList);
game.play();
