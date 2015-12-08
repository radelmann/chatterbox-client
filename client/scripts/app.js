$(document).ready(function() {
  $('#send').on('submit', function() {
    app.handleSubmit();
  });

  $('#main').on('click', '.chat-user', function() {
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
  var $chats = $("#chats");
  var $chatBody = $('<div class="chat"></div>');
  
  var $chatUser = $('<span class="chat-user"></span>');
  $chatUser.text(data.username);
  var $chatMessage = $('<span class="chat-message"></span>');
  $chatMessage.text(data.message);
  var $chatRoom = $('<span class="chat-room"></span>');
  $chatRoom.text(data.roomName);

  $chatUser.appendTo($chatBody);
  $chatMessage.appendTo($chatBody);
  $chatRoom.appendTo($chatBody);

  $chatBody.appendTo($chats);
}

app.addRoom = function(roomName) {
  var $rooms = $("#roomSelect")
  var $roomName = $('<div class="chat-room-select">' + roomName + '</div>');
  $roomName.appendTo($rooms);
}

app.addFriend = function(friend) {
  console.log('friend');
}

app.handleSubmit = function() {
  console.log('submit');
}