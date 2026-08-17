# 🎯 Bid War — Multiplayer Sealed-Bid Game

**Bid War** is a real-time multiplayer bidding game where two players compete across **10 rounds** using a limited pool of points.

Each player starts with **100 points**. In every round, both players submit a secret bid. The higher bid wins the round, but **both players spend their submitted bids**, regardless of who wins.

🌐 **Live Demo:** https://bid-wars-three.vercel.app/

---

## 🎮 How to Play

1. Read the game rules.
2. Enter your player name.
3. Create a room or join an existing room using a **4-digit room code**.
4. Wait for another player to join.
5. Each round, submit a sealed bid.
6. The player with the higher bid wins the round.
7. Both bids are deducted from the players' remaining points.
8. After 10 rounds, the player with the most round wins wins the match.
9. If the round score is tied, the player with more remaining points wins.

### Game Rules

* Both players start with **100 points**.
* Each bid must be between `0` and the player's remaining points.
* The highest bid wins the round.
* Both bids are deducted, whether the player wins or loses.
* Equal bids result in a tie.
* The game lasts **10 rounds**.
* If the final round score is tied, remaining points determine the winner.

---

## ✨ Features

* ⚔️ **Real-time 2-player multiplayer**
* 🔐 **Private game rooms**
* 🔢 **4-digit room codes**
* 💰 **Strategic point-based bidding**
* 🎯 **Sealed bidding system**
* 📊 **Live scoreboard**
* 🔄 **Round-by-round gameplay**
* 📜 **Complete bid history**
* 🏆 **Final winner and tie-breaker system**
* 👤 **Custom player names**
* 📱 **Responsive single-page interface**
* 🎨 **Auction-house inspired UI**

---

## 🕹️ Game Flow

```text
Rules
  ↓
Enter Name
  ↓
Create / Join Room
  ↓
Waiting for Opponent
  ↓
Game Starts
  ↓
Submit Bid
  ↓
Opponent Submits Bid
  ↓
Bids Revealed
  ↓
Round Winner Determined
  ↓
Next Round
  ↓
10 Rounds Completed
  ↓
Final Result + Bid Ledger
```

---

## 🧠 Game Mechanics

Each player begins with:

```text
100 Points
```

Suppose:

```text
Player 1 → 70 points
Player 2 → 80 points
```

They submit:

```text
Player 1 Bid → 30
Player 2 Bid → 25
```

Player 1 wins the round because:

```text
30 > 25
```

But both bids are spent:

```text
Player 1 → 70 - 30 = 40 points
Player 2 → 80 - 25 = 55 points
```

This creates a strategic trade-off between **winning individual rounds** and **saving points for later rounds**.

---

## 🏗️ Architecture

The application consists of a frontend and a real-time backend.

```text
                ┌──────────────────────┐
                │      Player 1        │
                │   Vercel Frontend    │
                └──────────┬───────────┘
                           │
                           │ Socket.IO
                           │
                           ▼
                ┌──────────────────────┐
                │   Node.js Backend    │
                │       Render         │
                └──────────┬───────────┘
                           │
                           │ Socket.IO
                           │
                           ▼
                ┌──────────────────────┐
                │      Player 2        │
                │   Vercel Frontend    │
                └──────────────────────┘
```

The frontend establishes a Socket.IO connection to the deployed backend:

```javascript
const socket = io('https://bid-wars-cd4l.onrender.com');
```

The frontend communicates with the server through events such as:

* `createRoom`
* `joinRoom`
* `submitBid`
* `nextRoundReady`
* `roomCreated`
* `gameStarted`
* `firstBidPlaced`
* `roundResolved`
* `startNextRound`
* `opponentLeft`

The Socket.IO client and backend connection are defined in the frontend implementation.

---

## 🛠️ Tech Stack

### Frontend

* HTML5
* CSS3
* JavaScript
* Socket.IO Client
* Google Fonts

### Backend

* Node.js
* Socket.IO
* Express / Node.js server

### Deployment

* **Frontend:** Vercel
* **Backend:** Render

---

## 📁 Project Structure

A typical project structure is:

```text
bid-war/
│
├── index.html
├── package.json
├── package-lock.json
├── server/
│   ├── server.js
│   └── package.json
│
└── README.md
```

> The exact backend folder structure may differ depending on your repository setup.

---

## 🚀 Running Locally

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd bid-war
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Start the frontend

Depending on your setup:

```bash
npm run dev
```

The application will then be available through your local development server.

### 4. Start the backend

Navigate to the backend directory:

```bash
cd server
npm install
```

Then start the server using your configured start command, for example:

```bash
npm start
```

---

## 🔌 Connecting the Frontend to the Backend

For local development, update the Socket.IO connection in the frontend:

```javascript
const socket = io('http://localhost:PORT');
```

For production, point it to your deployed Render backend:

```javascript
const socket = io('https://bid-wars-cd4l.onrender.com');
```

The current deployed frontend uses the Render Socket.IO endpoint.

---

## 📡 Socket.IO Events

### Client → Server

| Event            | Purpose                              |
| ---------------- | ------------------------------------ |
| `createRoom`     | Creates a new multiplayer room       |
| `joinRoom`       | Joins an existing room               |
| `submitBid`      | Sends a player's bid                 |
| `nextRoundReady` | Signals readiness for the next round |

### Server → Client

| Event            | Purpose                                             |
| ---------------- | --------------------------------------------------- |
| `roomCreated`    | Sends the generated room code                       |
| `gameStarted`    | Starts the match                                    |
| `firstBidPlaced` | Indicates the first player's bid has been submitted |
| `roundResolved`  | Provides both bids and resolves the round           |
| `startNextRound` | Starts the next round                               |
| `opponentLeft`   | Handles opponent disconnection                      |
| `errorMsg`       | Displays server-side errors                         |

---

## 💡 Strategy

Bid War isn't simply about bidding the highest amount.

You need to decide:

> **How many points is this round worth to me?**

For example, spending 50 points early may help you win a round, but it leaves you with only 50 points for the remaining rounds.

A good strategy requires balancing:

* Current round importance
* Opponent's remaining points
* Previous bids
* Remaining rounds
* Risk of tying
* Point conservation

---

## 📊 Point Groups

The game gives players an approximate indication of the opponent's remaining points:

| Remaining Points | Display  |
| ---------------: | -------- |
|           90–100 | 90 - 100 |
|            69–89 | 69 - 89  |
|            40–68 | 40 - 68  |
|            20–39 | 20 - 39  |
|             0–19 | 0 - 19   |

The opponent's exact remaining points are not directly displayed during gameplay.

---

## 🏆 Winning the Game

After 10 rounds:

```text
More Round Wins
       ↓
     Winner
```

If both players have the same number of round wins:

```text
More Remaining Points
       ↓
     Winner
```

If both the round score and remaining points are equal:

```text
Complete Draw
```

The final screen also displays the complete bid ledger containing every round's bids and winner.

---

## 🎨 UI Design

The interface uses an auction-house inspired visual theme featuring:

* Dark background
* Brass/gold accents
* Green felt-inspired panels
* Oxblood highlights
* Monospace typography for game information
* Animated lobby dial
* Ticket-style dividers
* Bid ledger presentation

The frontend defines custom design variables for the dark, brass, felt, and auction-inspired color palette.

---

## 🔮 Future Improvements

Possible improvements include:

* 🤖 Single-player mode with an AI opponent
* 🏅 Player rankings and leaderboards
* 🔐 Room passwords
* 💬 In-game chat
* ⏱️ Countdown timer for bids
* 📈 Player statistics
* 🎮 Spectator mode
* 🔊 Sound effects
* 📱 Improved mobile experience
* 💾 Persistent match history
* 🧑‍🤝‍🧑 Support for larger multiplayer rooms

---

## 📜 License

This project is available for educational and personal use.

---

## 👨‍💻 Author

**Shreyansh Saurabh**

Built as a real-time multiplayer web game demonstrating frontend development, Socket.IO communication, multiplayer room management, and game-state synchronization.

---

⭐ If you enjoyed **Bid War**, consider giving the repository a star!
