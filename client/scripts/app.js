$(document).ready(function() {
  $('#send').on('submit', function() {
    app.handleSubmit();
  });

  $('#main').on('click', '.username', function() {
    app.addFriend();
  });
});

var app = {};

app.server = "https://api.parse.com/1/classes/chatterbox"

app.init = function() {

}

app.send = function(msg) {
  $.ajax({
    type: "POST",
    url: app.server,
    data: JSON.stringify(msg),
    success: app.successSend,
    dataType: 'jsonp',
    error: function(data) {
      console.log("error")
    }
  });
}

app.fetch = function() {
  $.ajax({
    type: "GET",
    url: app.server,
    success: app.successFetch,
    dataType: 'jsonp'
  });

}

app.successSend = function() {

}

app.successFetch = function(data) {
  console.log(data)

}

app.clearMessages = function() {
  $("#chats").children().each(function() {
    $(this).remove()
  });
}

app.addMessage = function(data) {
  var $chats = $("#chats")
  var $message = $('<div><span class="username">' + data.username + '</span> ' + data.message + '<br>' + data.roomName + '</div>');
  $message.appendTo($chats);
}

app.addRoom = function(roomName) {
  var $rooms = $("#roomSelect")
  var $roomName = $('<div>' + roomName + '</div>');
  $roomName.appendTo($rooms);
}

app.addFriend = function(friend) {
  console.log('friend');
}

app.handleSubmit = function() {
  console.log('submit');
}