function howl(){

    var domain = makeSocketDomain();
    var socket = io.connect(domain);

    function init(){
        // Prevent scrolling
        document.body.addEventListener("touchmove", function(e){
            e.preventDefault();
        }, false);

        socket.on('updatechat', updatechat);

        socket.on('updateusers', updateusers);

        // iScroll
        document.addEventListener('touchmove', function(e){ e.preventDefault(); });
        myScroll = new iScroll('scroller');
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

    // Get socket domain and port
    function makeSocketDomain (url, port) {
         var q = (url||document.URL).match(/([^:]+):\/\/([^:\/]*)(:[0-9]+)?(\/)/);
         return q[1] + "://" + q[2] + (port ? (":" + port) : (q[3]?""+q[3]:""));
    }
}

$(function () {
    $('.datasend').click(function () {
        var data = $('.data');
        var message = data.val();
        data.val('');
        socket.emit('sendchat', message);
        data.focus();
    });

    $('.data').keypress(function (e) {
        if (e.which === 13) {
            $(this).blur();
            $('.datasend').focus().click();
        }
    });
    $('#set-username').submit(function (ev) {
        socket.emit('adduser', $('.username').val(), function (set) {
            if (!set) {
                $('.username-wrapper').hide();
                return $('.main').show();
            } else {
               return $('.username-error').show();
            }
        });
        return false;
    });

});