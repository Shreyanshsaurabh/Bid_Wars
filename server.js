const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*", // Required for CrazyGames to communicate with your Render server
        methods: ["GET", "POST"]
    }
});

app.use(express.static(__dirname + '/public')); // Serves the game files

const rooms = {}; // Stores all active games

function getDigitType(bid) {
    if (bid < 10) return "Single Digit (0-9)";
    if (bid < 100) return "Double Digit (10-99)";
    return "Triple Digit (100)";
}

io.on('connection', (socket) => {
    
    // 1. Host creates a room
    socket.on('createRoom', () => {
        const roomCode = Math.floor(1000 + Math.random() * 9000).toString();
        rooms[roomCode] = {
            p1: socket.id, 
            p2: null,
            p1Bid: null, 
            p2Bid: null,
            round: 1,
            firstBidder: 1, 
            currentTurn: 1,
            p1Ready: false, 
            p2Ready: false
        };
        socket.join(roomCode);
        socket.emit('roomCreated', roomCode);
    });

    // 2. Guest joins the room
    socket.on('joinRoom', (roomCode) => {
        if (rooms[roomCode] && !rooms[roomCode].p2) {
            rooms[roomCode].p2 = socket.id;
            socket.join(roomCode);
            // Tell both players the game is ready
            io.to(roomCode).emit('gameStarted', { firstBidder: rooms[roomCode].firstBidder });
        } else {
            socket.emit('errorMsg', 'Room is full or invalid code!');
        }
    });

    // 3. Handle Bidding turns
    socket.on('submitBid', (data) => {
        const { roomCode, bid } = data;
        const room = rooms[roomCode];
        if (!room) return;

        // Record the bid
        if (socket.id === room.p1) room.p1Bid = bid;
        if (socket.id === room.p2) room.p2Bid = bid;

        // If this is the FIRST bidder of the round
        if ((socket.id === room.p1 && room.currentTurn === 1) || 
            (socket.id === room.p2 && room.currentTurn === 2)) {
            
            room.currentTurn = room.currentTurn === 1 ? 2 : 1; // Switch turn to Player 2
            const digitType = getDigitType(bid);
            
            // Tell the second player it's their turn, and give them the hint
            io.to(roomCode).emit('firstBidPlaced', { 
                nextTurn: room.currentTurn, 
                digitType: digitType 
            });
        } 
        // If this is the SECOND bidder, the round is complete
        else if (room.p1Bid !== null && room.p2Bid !== null) {
            io.to(roomCode).emit('roundResolved', {
                p1Bid: room.p1Bid,
                p2Bid: room.p2Bid
            });
        }
    });

    // 4. Handle transition between rounds
    socket.on('nextRoundReady', (roomCode) => {
        const room = rooms[roomCode];
        if (!room) return;
        
        if (socket.id === room.p1) room.p1Ready = true;
        if (socket.id === room.p2) room.p2Ready = true;

        // When both players click "Next Round"
        if (room.p1Ready && room.p2Ready) {
            room.round++;
            room.firstBidder = room.firstBidder === 1 ? 2 : 1; // Alternate who goes first
            room.currentTurn = room.firstBidder;
            room.p1Bid = null;
            room.p2Bid = null;
            room.p1Ready = false;
            room.p2Ready = false;
            
            io.to(roomCode).emit('startNextRound', { 
                firstBidder: room.firstBidder, 
                round: room.round 
            });
        }
    });

    socket.on('disconnect', () => {
        // Clean up rooms if someone leaves (simplified)
        for (const code in rooms) {
            if (rooms[code].p1 === socket.id || rooms[code].p2 === socket.id) {
                socket.to(code).emit('opponentLeft');
                delete rooms[code];
            }
        }
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});