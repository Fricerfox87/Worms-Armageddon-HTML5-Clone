const express    = require('express');
const http       = require('http');
const { Server } = require('socket.io');
const path       = require('path');

const app    = express();
const server = http.createServer(app);
const io     = new Server(server, {
    cors: { origin: '*' }
});

// Sirve los ficheros estáticos del repo
app.use(express.static(path.join(__dirname)));

// ── Gestión de salas ──────────────────────────────────────────────

const rooms = {};

function makeCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', function (socket) {
    console.log('Connected:', socket.id);

    // Crear sala
    socket.on('room:create', function () {
        var code = makeCode();
        rooms[code] = { players: [socket.id], code: code };
        socket.join(code);
        socket.roomCode = code;
        socket.emit('room:created', { code: code });
        console.log('Room created:', code);
    });

    // Unirse a sala
    socket.on('room:join', function (data) {
        var code = data.code;
        var room = rooms[code];
        if (!room) {
            socket.emit('room:error', { msg: 'Room not found' });
            return;
        }
        if (room.players.length >= 2) {
            socket.emit('room:error', { msg: 'Room is full' });
            return;
        }
        room.players.push(socket.id);
        socket.join(code);
        socket.roomCode = code;

        var seed = Math.floor(Math.random() * 999999);

        // Avisar a los dos jugadores con su índice (0 o 1)
        room.players.forEach(function (id, index) {
            io.to(id).emit('game:start', { seed: seed, playerIndex: index });
        });
        console.log('Game started in room:', code);
    });

    // Relay de acciones de juego
    socket.on('game:action', function (data) {
        if (!socket.roomCode) return;
        socket.to(socket.roomCode).emit('game:action', data);
    });

    // Config de equipo (Módulo D)
    socket.on('team:config', function (data) {
        if (!socket.roomCode) return;
        socket.to(socket.roomCode).emit('team:rival', data);
    });

    // Desconexión
    socket.on('disconnect', function () {
        var code = socket.roomCode;
        if (code && rooms[code]) {
            socket.to(code).emit('room:error', { msg: 'Opponent disconnected' });
            delete rooms[code];
            console.log('Room deleted:', code);
        }
        console.log('Disconnected:', socket.id);
    });
});

var PORT = process.env.PORT || 8080;
server.listen(PORT, function () {
    console.log('Server running on port ' + PORT);
});
