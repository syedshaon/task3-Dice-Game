# Non-Transitive Dice Game

Welcome to the **Non-Transitive Dice Game!** This is a JavaScript-based console game that implements a generalized non-transitive dice game with configurable dice and fair random number generation. The game is designed to be transparent and fair, using cryptographic techniques to ensure that neither the player nor the computer can cheat.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [How to Play](#how-to-play)
- [Game Mechanics](#game-mechanics)
- [Fair Random Generation](#fair-random-generation)
- [Help Table](#help-table)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)

## Youtube Video

[![Watch the video](https://img.youtube.com/vi/9T06nmcu3f4/0.jpg)](https://www.youtube.com/watch?v=9T06nmcu3f4)

## Overview

The **Non-Transitive Dice Game** is a strategic game where players (a human and a computer) take turns selecting dice and rolling them to determine the winner. The dice are **non-transitive**, meaning that the winning relationship between them is not straightforward (e.g., _Dice A beats Dice B, Dice B beats Dice C, but Dice C beats Dice A_). The game uses cryptographic techniques to ensure fairness and transparency.

## Features

- **Configurable Dice:** Play with any number of dice, each with customizable face values.
- **Fair Random Generation:** Uses HMAC-SHA3-256 to ensure fair and verifiable random number generation.
- **Interactive CLI:** Play the game through a command-line interface with menus and prompts.
- **Help Table:** View a table of win probabilities for all dice pairs.
- **Pagination:** Supports pagination for the help table when there are many dice.

## Installation

### Prerequisites:

- [Node.js](https://nodejs.org/) (v14 or higher)
- npm (Node Package Manager)

### Clone the Repository:

```bash
git clone git@github.com:syedshaon/task3-Dice-Game.git
cd non-transitive-dice-game
```

### Install Dependencies:

```bash
npm install
```

### Run the Game:

```bash
node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3
```

## How to Play

### Start the Game:

Run the game with at least 3 dice configurations as command-line arguments. Each configuration should be a comma-separated list of integers representing the face values of a dice.

#### Example:

```bash
node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3
```

### Determine the First Move:

- The computer selects a random number (0 or 1) and displays its HMAC.
- You guess the computer's selection.
- The result determines who selects a dice first.

### Select Dice:

- The first player selects a dice from the available options.
- The second player selects a different dice.

### Roll the Dice:

- Both players perform a fair random roll using the selected dice.
- The player with the higher roll wins.

### View Help:

- At any time, you can view the help table to see the probabilities of winning for each dice pair.

## Game Mechanics

### Fair Random Generation

The game uses a **fair random generation protocol** to ensure transparency:

1. The computer generates a **secret key** and a **random number (x)**.
2. It computes the **HMAC** of `x` using the secret key and displays the HMAC.
3. You provide your number `(y)`.
4. The result is calculated as `(x + y) % range`.
5. The computer reveals its number `(x)` and the secret key, allowing you to verify the HMAC.

### Non-Transitive Dice

The dice are **non-transitive**, meaning the winning relationship between them is not straightforward. For example:

- Dice A beats Dice B.
- Dice B beats Dice C.
- Dice C beats Dice A.

This creates an **interesting strategic element** to the game.

## Help Table

The help table displays the probability of one dice beating another.

```
Probability of the win for the user:
+-------------+-------------+-------------+-------------+
| User Dice \ Computer Dice | Dice 1      | Dice 2      | Dice 3      |
+-------------+-------------+-------------+-------------+
| Dice 1      | -           | 0.5556      | 0.4444      |
| Dice 2      | 0.4444      | -           | 0.5556      |
| Dice 3      | 0.5556      | 0.4444      | -           |
+-------------+-------------+-------------+-------------+
```

## Examples

### Example 1: Basic Game

```bash
node game.js 2,2,4,4,9,9 6,8,1,1,8,6 7,5,3,7,5,3
```

### Example 2: Large Number of Dice

```bash
node game.js 1,2,3,4,5,6 2,3,4,5,6,7 3,4,5,6,7,8 4,5,6,7,8,9 5,6,7,8,9,10
```

### Example 3: Invalid Input

```bash
node game.js 2,2,4,4,9,9 6,8,1,1,8
```

#### Output:

```
Error: Invalid dice configuration "6,8,1,1,8". All values must be integers.
```

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. **Fork** the repository.
2. **Create** a new branch for your feature or bugfix.
3. **Commit** your changes.
4. **Submit** a pull request.

## License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

Enjoy the game! If you have any questions or feedback, feel free to **open an issue** or contact the maintainers.
