$(document).ready(function() {
  $('#send').on('click', function() {
    app.handleSubmit();
  });

  $('#main').on('click', '.chat-user', function() {
    app.addFriend();
  });

  app.init();
  app.fetch();
});

var app = {};

app.init = function() {
  app.server = "https://api.parse.com/1/classes/chatterbox";
  var rawUserName = window.location.search;
  app.userName = rawUserName.slice(rawUserName.indexOf("=")+1); 
  app.roomName = "myRoom";
}

app.send = function(msg) {
  $.ajax({
    type: "POST",
    url: app.server,
    data: JSON.stringify(msg),
    success: app.successSend,
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
  });

}

app.successSend = function() {
  app.fetch();

}

app.successFetch = function(data) {
  app.clearMessages();
  _.each(data["results"], function(item) {
    app.addMessage(item);  
  })
}

app.clearMessages = function() {
  $("#chats").children().each(function() {
    $(this).remove();
  });
}

app.addMessage = function(data) {
  var $chats = $("#chats");
  var $chatBody = $('<div class="chat"></div>');
  
  var $chatUser = $('<span class="chat-user"></span>');
  $chatUser.text(data.username);
  var $chatMessage = $('<span class="chat-message"></span>');
  $chatMessage.text(data.text);
  var $chatRoom = $('<span class="chat-room"></span>');
  $chatRoom.text(data.roomname);

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

app.handleSubmit = function(data) {
  var message = {
    username: app.userName,
    text: $('#message').val(),
    roomname: app.roomName
  }
  app.send(message);
}