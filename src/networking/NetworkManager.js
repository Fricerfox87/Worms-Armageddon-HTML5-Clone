// NetworkManager.js
// Reemplaza toda la lógica de Client.ts para el modo online

var NetworkManager = (function () {

    var socket = null;

    function init() {
        // Se conecta automáticamente al servidor que sirve la página
        socket = io();
    }

    function createRoom() {
        if (!socket) init();
        socket.emit('room:create');
    }

    function joinRoom(code) {
        if (!socket) init();
        socket.emit('room:join', { code: code });
    }

    function sendAction(data) {
        if (!socket) return;
        socket.emit('game:action', data);
    }

    function sendTeamConfig(config) {
        if (!socket) return;
        socket.emit('team:config', config);
    }

    function onRoomCreated(cb) {
        if (!socket) init();
        socket.on('room:created', cb);
    }

    function onRoomError(cb) {
        if (!socket) init();
        socket.on('room:error', cb);
    }

    function onGameStart(cb) {
        if (!socket) init();
        socket.on('game:start', cb);
    }

    function onGameAction(cb) {
        if (!socket) init();
        socket.on('game:action', cb);
    }

    function onTeamRival(cb) {
        if (!socket) init();
        socket.on('team:rival', cb);
    }

    // Inicializar al cargar
    init();

    return {
        createRoom:     createRoom,
        joinRoom:       joinRoom,
        sendAction:     sendAction,
        sendTeamConfig: sendTeamConfig,
        onRoomCreated:  onRoomCreated,
        onRoomError:    onRoomError,
        onGameStart:    onGameStart,
        onGameAction:   onGameAction,
        onTeamRival:    onTeamRival
    };

})();
