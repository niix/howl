
// Get socket domain and port
function makeSocketDomain (url, port) {
     var q = (url||document.URL).match(/([^:]+):\/\/([^:\/]*)(:[0-9]+)?(\/)/);
     return q[1] + "://" + q[2] + (port ? (":" + port) : (q[3]?""+q[3]:""));
}

var domain = makeSocketDomain();
var socket = io.connect(domain);

socket.on('updatechat', function (username, data) {
    $('.conversation').append('<b>' + username + ':</b> ' + data + '<br>');
});

socket.on('updateusers', function (data) {
    $('.users-list').empty();
    $.each(data, function(key, value) {
        $('.users-list').append('<div>' + key + '</div>');
    });
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

$(function () {
    $('.datasend').click(function () {
        var data = $('.data');
        var message = data.val();
        data.val('');
        socket.emit('sendchat', message);
    });

    $('.data').keypress(function (e) {
        if (e.which === 13) {
            $(this).blur();
            $('.datasend').focus().click();
        }
    });
});