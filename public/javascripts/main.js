require.config({
    shim: {
        'socketio': {
          exports: 'io'
        },
        'howl': {
          deps: [
            'jquery',
            'socketio',
            'iscroll'
          ]
        }
    },
    paths: {
        jquery: 'libs/jquery/jquery-1.9.1.min',
        iscroll: 'libs/iscroll/iscroll',
        ratchet: 'libs/ratchet/ratchet',
        socketio: '../socket.io/socket.io'
    }
});

require(["howl"], function() {
    // howl.init();
});