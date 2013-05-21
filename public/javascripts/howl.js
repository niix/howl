function howl(){

    var domain = makeSocketDomain();
    var socket = io.connect(domain);

    socket.on('updatechat', updatechat);
    socket.on('updateusers', updateusers);

    // iScroll
    document.addEventListener('touchmove', function(e){ e.preventDefault(); });
    myScroll = new iScroll('scroller');

    // Get socket domain and port
    function makeSocketDomain (url, port) {
         var q = (url||document.URL).match(/([^:]+):\/\/([^:\/]*)(:[0-9]+)?(\/)/);
         return q[1] + "://" + q[2] + (port ? (":" + port) : (q[3]?""+q[3]:""));
    }

    function updatechat(username, data) {
        var messages = document.getElementById('messages');
        $('.conversation').append('<li><b>' + username + ':</b> ' + data + '</li>');
        messages.scrollTop = messages.scrollHeight;
    }

    function updateusers(data) {
        $('.users-list').empty();
        $.each(data, function(key, value) {
            $('.users-list').append('<div>' + key + '</div>');
        });
    }

    this.getLocation = function(callback) {
        navigator.geolocation.getCurrentPosition(function(position, error) {
            if (error) return callback(err);
            return callback(null, position);
        });
    };

    this.sendMessage = function (message) {
        socket.emit('sendchat', message);
    };

    this.sendLocation = function(location) {
        socket.emit('location', location);
    };

    this.setUsername = function (info) {
        var dfd = $.Deferred();

        socket.emit('adduser', info.un, function(set){
            dfd.resolve(set);
        });

        return dfd.promise();
    };
}

$(function () {
    // Prevent scrolling
    document.body.addEventListener("touchmove", function(e){
        e.preventDefault();
    }, false);

    var Howl = new howl();

    // Bindings
    $('.datasend').click(function(){
        var data = $('.data');
        var message = data.val();
        data.val('').focus();
        Howl.sendMessage(message);
    });

    $('.data').keypress(function (e) {
        // watch for enter key
        if (e.which === 13) {
            $(this).blur();
            $('.datasend').focus().click();
        }
    });

    $('#set-username').click(function(e){
        e.preventDefault();
        var options = {
            "un": $('.username').val()
        };
        $.when(Howl.setUsername(options)).then(function(set){
            if (!set) {
                Howl.getLocation(function(err, position){
                    // Error
                    if (err !== null) return err;
                    // Success
                    $.when(Howl.sendLocation(position)).done(function(){
                        $('.username-wrapper').hide();
                        $('.main').show();
                    });
                });
            } else {
                $('.username-error').show();
            }
            $('.data').focus();
        });
    });
});